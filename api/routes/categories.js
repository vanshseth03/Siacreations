// Category Routes - All endpoints related to categories

import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
    try {
        const { showOnMainPage } = req.query;
        
        // Build query
        let query = {};
        if (showOnMainPage === 'true') query.showOnMainPage = true;
        
        // Get categories sorted by display order
        const categories = await Category.find(query).sort({ displayOrder: 1 });
        
        res.json({
            success: true,
            count: categories.length,
            categories
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            category
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
});

// POST /api/categories - Create new category
router.post('/', async (req, res) => {
    try {
        const { name, description, showOnMainPage, displayOrder } = req.body;
        
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }
        
        // Create new category
        const category = new Category({
            name,
            description,
            showOnMainPage: showOnMainPage || true,
            displayOrder: displayOrder || 0
        });
        
        await category.save();
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
});

export default router;

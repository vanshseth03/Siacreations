// Carousel Routes - All endpoints related to carousel/banner slides

import express from "express";
import Carousel from "../models/Carousel.js";

const router = express.Router();

// GET /api/carousel - Get all carousel slides
router.get('/', async (req, res) => {
    try {
        const { active } = req.query;
        
        // Build query
        let query = {};
        if (active === 'true') query.isActive = true;
        
        // Get carousel slides sorted by order
        const slides = await Carousel.find(query).sort({ order: 1 });
        
        res.json({
            success: true,
            count: slides.length,
            slides
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching carousel slides',
            error: error.message
        });
    }
});

// GET /api/carousel/:id - Get single carousel slide
router.get('/:id', async (req, res) => {
    try {
        const slide = await Carousel.findById(req.params.id);
        
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Carousel slide not found'
            });
        }
        
        res.json({
            success: true,
            slide
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching carousel slide',
            error: error.message
        });
    }
});

// POST /api/carousel - Create new carousel slide
router.post('/', async (req, res) => {
    try {
        const { imageUrl, buttonLink, description, order, isActive } = req.body;
        
        // Create new carousel slide
        const slide = new Carousel({
            imageUrl,
            buttonLink: buttonLink || '',
            description: description || '',
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true
        });
        
        await slide.save();
        
        res.status(201).json({
            success: true,
            message: 'Carousel slide created successfully',
            slide
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating carousel slide',
            error: error.message
        });
    }
});

// PUT /api/carousel/:id - Update carousel slide
router.put('/:id', async (req, res) => {
    try {
        const slide = await Carousel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Carousel slide not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Carousel slide updated successfully',
            slide
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating carousel slide',
            error: error.message
        });
    }
});

// DELETE /api/carousel/:id - Delete carousel slide
router.delete('/:id', async (req, res) => {
    try {
        const slide = await Carousel.findByIdAndDelete(req.params.id);
        
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Carousel slide not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Carousel slide deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting carousel slide',
            error: error.message
        });
    }
});

// PATCH /api/carousel/:id/toggle - Toggle slide active status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const slide = await Carousel.findById(req.params.id);
        
        if (!slide) {
            return res.status(404).json({
                success: false,
                message: 'Carousel slide not found'
            });
        }
        
        // Toggle active status
        slide.isActive = !slide.isActive;
        await slide.save();
        
        res.json({
            success: true,
            message: `Carousel slide ${slide.isActive ? 'activated' : 'deactivated'} successfully`,
            slide
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling slide status',
            error: error.message
        });
    }
});

export default router;

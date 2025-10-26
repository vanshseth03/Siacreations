// Upload Routes - Handle image uploads to ImageKit

import express from "express";
import multer from "multer";
import ImageKit from "imagekit";

const router = express.Router();

// Lazy initialization of ImageKit (only when needed)
let imagekit = null;

function getImageKit() {
    if (!imagekit) {
        // Check if credentials are available
        if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
            throw new Error('ImageKit credentials not found in environment variables. Please check your .env file.');
        }
        
        imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    }
    return imagekit;
}

// Configure multer for memory storage (we'll upload directly to ImageKit)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// POST /api/upload/image - Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        
        // Get ImageKit instance
        const ik = getImageKit();
        
        // Upload to ImageKit
        const result = await ik.upload({
            file: req.file.buffer.toString('base64'),  // Convert buffer to base64
            fileName: req.file.originalname,
            folder: '/sia-creations/products'  // Organize in folder
        });
        
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            image: {
                url: result.url,
                fileId: result.fileId,
                name: result.name,
                size: result.size
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

// POST /api/upload/images - Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
        }
        
        // Get ImageKit instance
        const ik = getImageKit();
        
        // Upload all images to ImageKit
        const uploadPromises = req.files.map(file => {
            return ik.upload({
                file: file.buffer.toString('base64'),
                fileName: file.originalname,
                folder: '/sia-creations/products'
            });
        });
        
        const results = await Promise.all(uploadPromises);
        
        const images = results.map(result => ({
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            size: result.size
        }));
        
        res.json({
            success: true,
            message: `${images.length} images uploaded successfully`,
            images
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
        });
    }
});

// POST /api/upload/carousel - Upload carousel/banner image
router.post('/carousel', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        
        // Get ImageKit instance
        const ik = getImageKit();
        
        // Upload to ImageKit in carousel folder
        const result = await ik.upload({
            file: req.file.buffer.toString('base64'),
            fileName: req.file.originalname,
            folder: '/sia-creations/carousel'
        });
        
        res.json({
            success: true,
            message: 'Carousel image uploaded successfully',
            image: {
                url: result.url,
                fileId: result.fileId,
                name: result.name,
                size: result.size
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading carousel image',
            error: error.message
        });
    }
});

// DELETE /api/upload/:fileId - Delete image from ImageKit
router.delete('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        
        // Get ImageKit instance
        const ik = getImageKit();
        
        await ik.deleteFile(fileId);
        
        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting image',
            error: error.message
        });
    }
});

// GET /api/upload/auth - Get ImageKit authentication parameters for frontend
router.get('/auth', async (req, res) => {
    try {
        // Get ImageKit instance
        const ik = getImageKit();
        
        const authenticationParameters = ik.getAuthenticationParameters();
        
        res.json({
            success: true,
            auth: authenticationParameters
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting auth parameters',
            error: error.message
        });
    }
});

export default router;

import mongoose, { Schema, Document } from 'mongoose';
interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    ratings: number;
    images: { url: string; publicId: string }[];
    numReviews: number;
    reviews: {
        userId: mongoose.Schema.Types.ObjectId;
        name: string;
        rating: number;
        comment: string;
    }[];
    isFeatured: boolean;
    createdAt: Date;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    images: [
        {
            url: { type: String, required: true },
            publicId: { type: String, required: true }
        }
    ],
    numReviews: { type: Number, default: 0 },
    reviews: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true }
        }
    ],
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', productSchema);

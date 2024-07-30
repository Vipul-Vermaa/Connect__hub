var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
export const signUpSchema = z.object({
    name: z
        .string({ required_error: 'Naam is required' })
        .trim()
        .min(3, { message: 'atleast 3' }),
    email: z
        .string({ message: 'Enter Your Email' })
        .email({ message: 'Invalid email format' }),
    password: z
        .string()
        .min(6, { message: 'must be six letter or more' }),
    posts: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/)
        .optional())
        .default([]),
    followers: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
        .optional()
        .default([]),
    following: z
        .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
        .optional()
        .default([]),
});
export const validate = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parseBody = yield schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            const message = error.errors[0].message;
            res.status(400).json({ msg: message });
        }
        else {
            next(error);
        }
    }
});
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter name'],
    },
    email: {
        type: String,
        required: [true, 'Enter email'],
        unique: true,
        validate: [validator.isEmail, 'Invalid email format'],
    },
    password: {
        type: String,
        required: [true, 'Enter password'],
        select: false,
    },
    posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "postModel",
        }],
    avatar: {
        public_id: String,
        url: String,
    },
    followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
            // default:[],
        }],
    following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel',
            // default:[],
        }],
});
schema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcrypt.hash(this.password, 10);
        next();
    });
});
schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '10d', });
};
schema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(password, this.password);
    });
};
export const userModel = mongoose.model('userModel', schema);

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    console.error("Auth error:", error.message || error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
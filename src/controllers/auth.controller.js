import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from '../config.js';
import { generateToken } from '../utils/jwt.utils.js';
import User from '../models/user.model.js';
import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/DB';
import User from '@/models/User';
import bcrypt from 'bcrypt'



export const AuthOptions: NextAuthOptions = {
    providers: [
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    email: {label: "Email", type: "text"},
                    password: {label: "Password", type: "password"}    
                },

                
                
                async authorize(credentials){
                    console.log('Line-19 :', credentials);
                    if(!credentials?.email || !credentials?.password){
                        throw new Error("Missing Email or Password")
                    }
                    try{
                        await connectToDatabase();
                        const user = await User.findOne({email: credentials.email}).select("+password")
                        console.log( 'line 26 user :', user);
                        
                        
                        if(!user){
                            throw new Error('User not exist')
                        }

                        const isValid = await bcrypt.compare(credentials.password, user.password)
                        if(!isValid){
                            throw new Error('invalid Password')
                        }

                       

                        return{
                            id: user._id.toString(),
                            email: user.email
                        }
                    }
                    catch(error){
                        console.error("Auth Error : ", error)
                        throw error
                    }
                }, 
            }) 
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }   
            return token
        },
        
        async session({session, token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};
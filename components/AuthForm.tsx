"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";
import {
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

const authFormSchema = (type:FormType)=>{
  return z.object({
    name: type === "sign-up" ? z.string().min(3).max(50) : z.string().optional(),// Name is required only for sign-up...not for sign in isliye condition dena pada hame
    email: z.string().email(),
    password: z.string().min(3).max(50),

  })
}

const AuthForm = ({type}:{type:FormType}) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",

    },
  });

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try{

      if(type === "sign-in"){
        const {email,password}=values;
        const userCredential=await signInWithEmailAndPassword(auth,email,password);//it will give back the user credential from which we can generate the short lived auth token 
        const idToken=await userCredential.user.getIdToken();
        if(!idToken)
        {
          toast.error('Sign In failed');
          return;
        }
        await signIn({
          email,idToken
        })
        toast.success("Sign In Successful");
        // Handle sign-in logic
        router.push("/");

      //  console.log("SIGN IN", values);
        // You can call your API here to sign in the user
      }else{
        // Handle sign-up logic

        //values nikal liya form me jo v hai unko destructure kr liya maine 
        const {name,email,password}=values;
   

        //it is function provided by the firebase
        const userCredentials=await createUserWithEmailAndPassword(auth,email,password);

        const result=await signUp(
          {
            uid:userCredentials.user.uid,
            name:name!,
            email,
            password,
          }
        )
        if(!result?.success)
        {
          toast.error(result?.message);
          return;
          
        }
        toast.success("Sign Up Successful");
        router.push("/sign-in")
      //  console.log("SIGN UP", values);
        // You can call your API here to sign up the user
      }

    }
    catch(error){
         console.log(error);
          // Handle the error appropriately, e.g., show a toast notification
          toast.error(`There was an Error: ${error}`);
    }
  }

  const isSignIn= type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.png" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Prepify</h2>
        </div>
        <h3 className=" text-center">Practice Job interview with AI</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
          {/* render the name only if it is not sign-in */}

         {/* <p>Name</p> */}
         {!isSignIn && (<FormField control={form.control} name="name" label="Name" placeholder="Your name" type="text" />)}
       <FormField control={form.control} name="email" label="Email" placeholder="Your email address" type="text" />
       <FormField control={form.control} name="password" label="Password" placeholder="Your password" type="password" />
          <Button className="btn" type="submit">{isSignIn ? "Sign In" : "Create an Account"}</Button>
        </form>
      </Form>
      <p className="text-center text-white">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}
        <Link href={!isSignIn ? "/sign-in" : "/sign-up"} className="font-bold text-user-primary ml-1">
          {!isSignIn ? "Sign In" : "Sign Up"}
        </Link>

      </p>
        </div>
    </div>
  );
};

export default AuthForm;

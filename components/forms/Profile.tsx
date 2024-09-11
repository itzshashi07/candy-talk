"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ProfileSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { updateUser } from "@/lib/actions/user.action";
import { toast } from "@/hooks/use-toast";

interface Props {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const parsedUser = JSON.parse(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      bio: parsedUser.bio || "",
      college: parsedUser.college || "",
      instagram: parsedUser.instagram || "",
    },
  });
  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          bio: values.bio,
          college: values.college,
          instagram: values.instagram,
        },
        path: pathname,
      });
      toast({
        title: `Wow! Your Profile looks bindass AF ✨`,
        variant: "default",
      });
      router.back();
    } catch (error) {
      console.error(error);
      toast({
        title: `Something bad happened 🙄`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  placeholder="Your name"
                  spellCheck={false}
                  className="mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  placeholder="Your username"
                  spellCheck={false}
                  className="mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio
              </FormLabel>
              <FormControl className="mt-3.5">
                <Textarea
                  {...field}
                  placeholder="What's something bindass about you ?"
                  spellCheck={false}
                  className="h-[15vh] no-scrollbar resize-none mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                College Name
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  placeholder="What's your college name ?"
                  spellCheck={false}
                  className="mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Instagram Profile Link
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  placeholder="Your Instgram Profile Link"
                  spellCheck={false}
                  className="mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <Button
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default Profile;

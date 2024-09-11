"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ReplySchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createReply } from "@/lib/actions/reply.action";
import { toast } from "@/hooks/use-toast";

interface Props {
  noteId: string;
  authorId: string;
}

const Reply = ({ noteId, authorId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ReplySchema>>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      reply: "",
      anonymity: "true",
    },
  });
  const handleCreateReply = async (values: z.infer<typeof ReplySchema>) => {
    setIsSubmitting(true);
    try {
      const isAnonymous = values.anonymity === "true";
      await createReply({
        content: values.reply,
        author: JSON.parse(authorId),
        note: JSON.parse(noteId),
        path: pathname,
        isAnonymous: isAnonymous,
      });
      toast({
        title: `Great! You created a reply successfully ✨`,
        variant: "default",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Oh no! Something bad happened 🙄",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h4 className="paragraph-semibold text-dark400_light800">
        Write your reply below
      </h4>
      <Form {...form}>
        <form
          className="mt-1 w-full flex flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateReply)}
        >
          <FormField
            control={form.control}
            name="reply"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormControl className="mt-3.5">
                  <Textarea
                    {...field}
                    spellCheck={false}
                    className="h-[15vh] no-scrollbar resize-none mt-2 no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormDescription className="body-regular mt-2.5 text-light-500">
                  Avoid using indescent or offensive language.
                </FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anonymity"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Want to display your name on the reply ?
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="body-regular light-border background-light800_dark300 text-dark500_light700 px-3 py-2.5">
                      <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
                      <SelectGroup>
                        <SelectItem value="true">
                          Do not display my name
                        </SelectItem>
                        <SelectItem value="false">Display my name</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="primary-gradient w-fit !text-light-900"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Posting Reply" : "Post Reply"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Reply;

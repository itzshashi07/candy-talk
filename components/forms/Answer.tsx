"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { AnswerSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { createAnswer } from "@/lib/actions/asnwer.action";
import { usePathname } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });
  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });
      toast({
        title: `Great! You created an answer successfully ✨`,
        variant: "default",
      });
      form.reset();
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
    <div>
      <h4 className="paragraph-semibold text-dark400_light800">
        Write your answer below
      </h4>

      <Form {...form}>
        <form
          className="mt-4 w-full flex flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
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
                  Try to write down the answer as detailed as possible.
                </FormDescription>
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
              {isSubmitting ? "Posting Answer" : "Post Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;

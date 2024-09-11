import { Button } from "@/components/ui/button";
import Link from "next/link";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About | Candy Talk",
  description: "About Page - Candy Talk",
  icons: {
    icon: "/assets/icons/fav.svg",
  },
};
const page = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="h1-bold text-dark100_light900 mb-8">About Candy Talk</h1>

      {/* About the App Section */}
      <section className="mb-12">
        <h2 className="h2-semibold text-primary-500 mb-4">Our Thought</h2>
        <p className="paragraph-regular text-dark300_light700">
          Candy Talk is a platform created to empower you to freely express
          your thoughts, share opinions, and connect with like-minded
          individuals. Our goal is to foster a safe and inclusive community
          where everyone feels comfortable sharing their views, whether
          anonymously or openly. Here, your voice matters.
        </p>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="h2-semibold text-primary-500 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 text-dark300_light700">
          <li className="mb-2">
            <strong>Anonymous Posts:</strong> Share your opinions or confessions
            anonymously, allowing you to be candid and honest without fear of
            judgment.
          </li>
          <li className="mb-2">
            <strong>User Shoutouts:</strong> Recognize and celebrate the
            achievements of your friends and peers with personalized shoutouts.
          </li>
          <li className="mb-2">
            <strong>Question & Answer Forums:</strong> Engage in meaningful
            discussions and get answers to your questions from the community.
          </li>
          <li className="mb-2">
            <strong>Reputation & Badges:</strong> Earn badges and build your
            reputation through positive contributions and engagement.
          </li>
        </ul>
      </section>

      {/* Guidelines Section */}
      <section className="mb-12">
        <h2 className="h2-semibold text-primary-500 mb-4">
          Community Guidelines
        </h2>
        <p className="paragraph-regular text-dark300_light700">
          At Candy Talk, we believe in fostering a positive and respectful
          community. To ensure a welcoming environment for everyone, we ask our
          users to adhere to the following guidelines:
        </p>
        <ul className="list-disc pl-6 text-dark300_light700 mt-4">
          <li className="mb-2">
            <strong>Respect Others:</strong> Avoid using language that is
            harmful, abusive, or disrespectful. Treat others as you would like
            to be treated.
          </li>
          <li className="mb-2">
            <strong>No Hate Speech:</strong> Refrain from posting content that
            promotes violence, discrimination, or hate towards any individual or
            group.
          </li>
          <li className="mb-2">
            <strong>Avoid Inappropriate Content:</strong> Ensure that your posts
            and confessions do not contain sexually explicit, obscene, or
            offensive material.
          </li>
          <li className="mb-2">
            <strong>Constructive Feedback:</strong> Provide feedback that is
            constructive and aimed at fostering growth and understanding.
          </li>
        </ul>
      </section>

      {/* Safety and Privacy Section */}
      <section className="mb-12">
        <h2 className="h2-semibold text-primary-500 mb-4">Your Privacy</h2>
        <p className="paragraph-regular text-dark300_light700">
          Your privacy is our top priorities. The only things we don't expect
          are harmful content, hateful speech, abusive language and breaking
          someone's privacy by doing certain actions on platform.
        </p>
        <p className="paragraph-regular text-dark300_light700 mt-4">
          Remember, you have control over your content. Whether you choose to
          post anonymously or under your name, your identity is protected.
        </p>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-10">
        <h2 className="h2-semibold text-primary-500 mb-4">
          Join Our Community
        </h2>
        <p className="paragraph-regular text-dark300_light700 mb-6">
          Become a part of Candy Talk today and start sharing your thoughts,
          connecting with others, and making your voice heard. Let's build a
          community where everyone feels valued and heard.
        </p>
        <Link href="/sign-up">
          <Button className="primary-gradient px-6 py-3 text-light-900">
            Sign Up Now
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default page;

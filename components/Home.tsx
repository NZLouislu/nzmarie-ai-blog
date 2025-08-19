"use client";

import * as Separator from "@radix-ui/react-separator";
import { Box, Heading, Text, Flex } from "@radix-ui/themes";
import BlogList from "@/components/BlogList";
import AboutMe from "./AboutMe";

export default function HomePage() {
  return (
    <Box className="w-full px-4 mx-auto max-w-[900px]">
      <div className="flex flex-col items-center">
        <Heading size="4" className="text-4xl font-bold my-8">
          NZLouis&apos; Blog
        </Heading>
        <Text size="2" className="text-lg text-gray-600 text-center">
          If you never try, you will never know.
        </Text>
      </div>

      <Separator.Root
        orientation="horizontal"
        decorative
        className="bg-gray-200 my-8 h-px w-full"
      />

      <Flex className="flex flex-col lg:flex-row gap-8">
        <Box className="lg:flex-[7] w-full">
          <BlogList />
        </Box>
        <Box className="lg:flex-[3] w-full">
          <AboutMe />
        </Box>
      </Flex>
    </Box>
  );
}

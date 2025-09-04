"use client";

import * as Separator from "@radix-ui/react-separator";
import { Box, Heading, Text, Flex } from "@radix-ui/themes";
import BlogList from "@/components/BlogList";
import AboutMe from "./AboutMe";

export default function HomePage() {
  return (
    <Box className="w-full px-6 py-12 mx-auto max-w-[1200px]">
      <div className="flex flex-col items-center mb-20">
        <Heading
          size="6"
          className="text-5xl font-bold mb-2 leading-loose bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          NZLouis&apos; Blog
        </Heading>
        <Text size="3" className="text-xl text-gray-600 text-center max-w-2xl">
          If you never try, you will never know.
        </Text>
      </div>

      <Separator.Root
        orientation="horizontal"
        decorative
        className="bg-gradient-to-r from-transparent via-gray-300 to-transparent my-12 h-px w-full"
      />

      <Flex className="flex flex-col md:flex-row gap-12 md:justify-center">
        <Box className="md:flex-[7] w-full max-w-[900px]">
          <BlogList />
        </Box>
        <Box className="md:flex-[3] w-full">
          <AboutMe />
        </Box>
      </Flex>
    </Box>
  );
}

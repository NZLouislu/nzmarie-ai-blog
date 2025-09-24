export default function Footer() {
  return (
    <footer className="mt-12 py-8 text-center">
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
        <a
          href="https://nzmarie.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          title="Visit nzmarie.com"
        >
          <span className="text-white font-bold text-base sm:text-lg">M</span>
        </a>

        <a
          href="mailto:marie@ssrealty.co.nz"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          title="Send email"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </a>

        <a
          href="https://www.linkedin.com/in/nzmarie"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl"
          title="Visit LinkedIn"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>

      <div className="text-sm text-gray-500">
        © {new Date().getFullYear()} NZMarie | Marie Nian. All rights reserved.
      </div>
    </footer>
  );
}

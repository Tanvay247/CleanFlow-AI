"use client";

type Props = {
  href: string;
};

export default function DownloadButton({ href }: Props) {
  return (
    <a
      href={href}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex h-11 w-36 items-center justify-center overflow-hidden rounded-xl bg-white transition-all duration-300 hover:bg-green-600"
    >
      {/* Text */}
      <span className="absolute inset-0 flex items-center justify-center text-black font-medium transition-all duration-300 group-hover:-translate-y-full">
        Download File
      </span>

      {/* Icon */}
      <span className="absolute inset-0 flex translate-y-full items-center justify-center text-white transition-all duration-300 group-hover:translate-y-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 15V3" />
          <path d="M8 11l4 4 4-4" />
          <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
        </svg>
      </span>
    </a>
  );
}
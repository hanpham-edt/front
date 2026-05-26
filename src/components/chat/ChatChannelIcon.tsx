type Channel = "zalo" | "facebook" | "whatsapp";

export default function ChatChannelIcon({
  channel,
  className = "h-6 w-6",
}: {
  channel: Channel;
  className?: string;
}) {
  if (channel === "zalo") {
    return (
      <svg className={className} viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="24" fill="#0068FF" />
        <path
          fill="#fff"
          d="M16.5 14h15c2.2 0 4 1.8 4 4v8.5c0 2.2-1.8 4-4 4H22l-6.5 4.5V30h-1c-2.2 0-4-1.8-4-4V18c0-2.2 1.8-4 4-4zm2.2 6.8l3.1 3.3 5.6-6.1 2.8 2.5-8.4 9.2-5.9-6.3-2.8 2.6z"
        />
      </svg>
    );
  }

  if (channel === "facebook") {
    return (
      <svg className={className} viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="24" fill="#1877F2" />
        <path
          fill="#fff"
          d="M27.5 14h-4.2c-3.8 0-6.3 2.5-6.3 6.4v2.8H14v5.2h2.9v13.2h5.6V28.4h5.1l.8-5.2h-5.9v-2.4c0-1.6.8-2.4 2.4-2.4H27.5V14z"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#25D366" />
      <path
        fill="#fff"
        d="M24 13c-6.1 0-11 4.5-11 10.1 0 3.2 1.7 6 4.4 7.8l-.9 3.4 3.9-1.5c1.1.3 2.2.5 3.4.5 6.1 0 11-4.5 11-10.1S30.1 13 24 13zm5.8 12.5c-.2.6-1.2 1.1-1.7 1.1-.4 0-1 .2-3.3-.7-2.8-1.1-4.6-3.8-4.7-4-.1-.2-.9-1.2-.9-2.3 0-1.1.6-1.6.8-1.8.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.7.8 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.2.3-.1.5.1.2.5 1.2 1.2 1.9 1.7 1.5 3.1 1.9 3.6 2 .5.1 1.3.1 1.7-.6.4-.7.4-1.3.3-1.4z"
      />
    </svg>
  );
}

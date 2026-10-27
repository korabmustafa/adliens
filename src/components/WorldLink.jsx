import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

// Keep ordinary links (including new tabs) while progressively enhancing travel.
export function WorldLink({ to, state, children, onClick, ...props }) {
  const navigate = useNavigate();
  return (
    <Link
      {...props}
      to={to}
      state={state}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          !document.startViewTransition ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        event.preventDefault();
        document.startViewTransition(() =>
          flushSync(() => navigate(to, { state })),
        );
      }}
    >
      {children}
    </Link>
  );
}

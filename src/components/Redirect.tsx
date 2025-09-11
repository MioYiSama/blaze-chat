import { useNavigate } from "@solidjs/router";

export default function Redirect(path: string) {
  return () => {
    const navigate = useNavigate();

    navigate(path, { replace: true });

    return <></>;
  };
}

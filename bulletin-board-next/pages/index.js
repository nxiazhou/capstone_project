import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);

  return null; // 页面跳转中
}
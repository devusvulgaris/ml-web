import { type FC, type ReactNode } from "react";
import Header from "../header";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="container mx-auto">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

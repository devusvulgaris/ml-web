import React from "react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="container mx-auto my-4 p-4">
      <h2 className="text-lg">Machine Learning Fundamentals</h2>
      <Navbar>
        <NavbarContent>
          <NavbarItem>Classification</NavbarItem>
          <NavbarItem>Regression</NavbarItem>
        </NavbarContent>
      </Navbar>
    </header>
  );
};

export default Header;

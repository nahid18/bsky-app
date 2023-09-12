import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

export default function NavBar() {
  return (
    <Navbar shouldHideOnScroll isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">bsky follow</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <Link
            href="https://github.com/nahid18/bsky-follow-API"
            target="_blank"
            rel="noopener noreferrer"
          >
            API Doc
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="https://github.com/nahid18/bsky-app"
            variant="flat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

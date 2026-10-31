/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
import React from "react";
import { render, screen } from "@testing-library/react";
import {
  isEmpty,
  popupWindow,
  mergeObjects,
  wrapWithDiv,
  getTypeLabel,
  findProduct,
  getImage,
  gridViewDropdown,
  arrangeSelectedIds,
  getItemStatusMap,
  removeHTMLTags,
  EmptyObjForSearchCase,
} from ".";

describe("utils", () => {
  it("isEmpty treats undefined, null, {}, [] and blank strings as empty", () => {
    [undefined, null, {}, [], "", "  "].forEach((v) =>
      expect(isEmpty(v)).toBe(true)
    );
    [0, "a", { a: 1 }, [1], false].forEach((v) =>
      expect(isEmpty(v)).toBe(false)
    );
  });

  it("popupWindow opens a centred window with the given size", () => {
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    popupWindow({ url: "https://x.test/p", title: "T", w: 100, h: 50 });
    expect(open).toHaveBeenCalledWith(
      "https://x.test/p",
      "T",
      expect.stringContaining("width=100, height=50")
    );
    open.mockRestore();
  });

  it("mergeObjects deep-merges source into target", () => {
    const target = { a: { x: 1, y: 2 }, b: 1 };
    const out = mergeObjects(target, { a: { y: 3 }, c: 4 });
    expect(out).toEqual({ a: { x: 1, y: 3 }, b: 1, c: 4 });
  });

  it("labels singular and plural for products and categories", () => {
    expect(getTypeLabel("product", 1)).toBe("Product");
    expect(getTypeLabel("product", 2)).toBe("Products");
    expect(getTypeLabel("category", 1)).toBe("Category");
    expect(getTypeLabel("category", 2)).toBe("Categories");
  });

  it("strips HTML tags from descriptions", () => {
    expect(removeHTMLTags("<p>hi</p>")).toBe(" hi ");
    expect(removeHTMLTags("")).toBe("");
  });

  it("wrapWithDiv renders text without tags, or nothing for an empty description", () => {
    render(<div data-testid="w">{wrapWithDiv("<b>bold</b>")}</div>);
    expect(screen.getByTestId("w").textContent?.trim()).toBe("bold");
    expect(wrapWithDiv("")).toBe("");
  });

  it("findProduct returns the match or an empty object", () => {
    expect(findProduct([{ id: 1, n: "a" }], 1)).toEqual({ id: 1, n: "a" });
    expect(findProduct([{ id: 1 }], 2)).toEqual({});
    expect(findProduct(undefined, 2)).toEqual({});
  });

  it("getImage shows the image, or the no-image placeholder", () => {
    const { container, rerender } = render(
      <>{getImage("https://i.test/a.png")}</>
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://i.test/a.png"
    );
    expect(container.querySelector(".selector-product-image")).toBeTruthy();
    rerender(<>{getImage("", true)}</>);
    expect(container.querySelector(".custom-field-product-image")).toBeTruthy();
    expect(container.querySelector("img")?.getAttribute("alt")).toBeTruthy();
  });

  it("arrangeSelectedIds keeps the earlier order and appends new ids", () => {
    expect(arrangeSelectedIds([3, 1], [1, 2, 3])).toEqual([3, 1, 2]);
    expect(arrangeSelectedIds([], [5])).toEqual([5]);
  });

  it("getItemStatusMap marks a range", () => {
    expect(getItemStatusMap({ 0: "loaded" }, "loading", 1, 3)).toEqual({
      0: "loaded",
      1: "loading",
      2: "loading",
    });
  });

  it("offers a card and a list view, card first", () => {
    expect(gridViewDropdown.map((g) => g.value)).toEqual(["card", "list"]);
    render(<>{gridViewDropdown.map((g) => g.label)}</>);
  });

  it("has an empty-search state with a heading and help link", () => {
    render(
      <div>
        {EmptyObjForSearchCase.heading}
        {EmptyObjForSearchCase.description}
        {EmptyObjForSearchCase.actions}
      </div>
    );
    expect(screen.getByText(/matching results/i)).toBeInTheDocument();
  });
});

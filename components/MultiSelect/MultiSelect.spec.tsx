import { fireEvent, render, screen } from "@testing-library/react";
import MultiSelect, { MultiSelectOption } from "./MultiSelect";
import "@testing-library/jest-dom";

const options: Array<MultiSelectOption> = [
  { id: "1", label: "Thrillers", value: "Thrillers" },
  { id: "2", label: "Fantasy", value: "Fantasy" },
];

describe("MultiSelect", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("should display components", () => {
    render(<MultiSelect title="Product groups" options={options} />);

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getAllByRole("checkbox")[0]).toHaveAccessibleName(
      "Thrillers"
    );
    expect(screen.getAllByRole("checkbox")[1]).toHaveAccessibleName("Fantasy");
    expect(screen.getByTestId("search-bar")).toBeTruthy();
    expect(screen.getByRole("button", { name: /toepassen/i })).toBeTruthy();
  });

  it("should display loading state", () => {
    render(
      <MultiSelect title="Product groups" options={options} loading={true} />
    );

    expect(screen.getByText("Loading...")).toBeDefined();
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("should display error state", () => {
    render(
      <MultiSelect title="Product groups" options={options} isErrored={true} />
    );

    expect(screen.getByText("Failed to get options.")).toBeTruthy();
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });

  it("should select an option and move it to the top of the list", () => {
    render(<MultiSelect title="Product groups" options={options} />);

    const firstItem = screen.getByRole("checkbox", { name: "Thrillers" });
    const lastItem = screen.getByRole("checkbox", { name: "Fantasy" });
    fireEvent.click(lastItem);

    expect(firstItem).not.toBeChecked();
    expect(lastItem).toBeChecked();
    // order should change because of selection
    const updatedCheckboxes = screen.getAllByRole("checkbox");
    expect(updatedCheckboxes[0]).toHaveAccessibleName("Fantasy");
    expect(updatedCheckboxes[1]).toHaveAccessibleName("Thrillers");
  });

  it("should unselect an option and remove it from the top of the list", () => {
    // Fantasy pre-selected
    window.localStorage.setItem("multiSelectCache - Product groups", '["2"]');
    render(<MultiSelect title="Product groups" options={options} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Fantasy" }));

    const updatedCheckboxes = screen.getAllByRole("checkbox");
    const expectedNames = ["Thrillers", "Fantasy"];
    updatedCheckboxes.forEach((checkbox, index) => {
      expect(checkbox).toHaveAccessibleName(expectedNames[index]);
      expect(checkbox).not.toBeChecked();
    });
  });

  it("should sort selected options in an ascending order", () => {
    // Both groups pre-selected
    window.localStorage.setItem(
      "multiSelectCache - Product groups",
      '["1","2"]'
    );
    render(<MultiSelect title="Product groups" options={options} />);

    const checkboxes = screen.getAllByRole("checkbox");
    const expectedNames = ["Fantasy", "Thrillers"];
    checkboxes.forEach((checkbox, index) => {
      expect(checkbox).toHaveAccessibleName(expectedNames[index]);
      expect(checkbox).toBeChecked();
    });
  });

  it("should update selected options in localStorage", () => {
    // both groups pre-selected
    window.localStorage.setItem(
      "multiSelectCache - Product groups",
      '["1","2"]'
    );
    render(<MultiSelect title="Product groups" options={options} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Thrillers" }));

    expect(
      window.localStorage.getItem("multiSelectCache - Product groups")
    ).toEqual('["2"]');
  });
});

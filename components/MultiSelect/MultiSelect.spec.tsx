import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

    expect(screen.getByTestId("search bar")).toBeDefined();
    expect(screen.getAllByTestId("checkbox")).toHaveLength(2);
    expect(screen.getByTestId("button type - submit")).toBeDefined();
  });

  it("should display loading state", () => {
    render(
      <MultiSelect title="Product groups" options={options} loading={true} />
    );

    expect(screen.getByText("Loading...")).toBeDefined();
    expect(screen.queryAllByTestId("checkbox")).toHaveLength(0);
  });

  it("should display error state", () => {
    render(
      <MultiSelect title="Product groups" options={options} isErrored={true} />
    );

    expect(screen.getByText("Failed to get options.")).toBeDefined();
    expect(screen.queryAllByTestId("checkbox")).toHaveLength(0);
  });

  it("should select an option and move it to the top of the list", () => {
    render(<MultiSelect title="Product groups" options={options} />);

    fireEvent.click(screen.getByTestId("checkbox - filtered option - 1"));

    expect(screen.getByTestId("checkbox - selected option - 1")).toBeChecked();
    expect(screen.queryByTestId("checkbox - filtered option - 1")).toBeNull();
  });

  it("should unselect an option and remove it from the top of the list", () => {
    render(<MultiSelect title="Product groups" options={options} />);

    fireEvent.click(screen.getByTestId("checkbox - filtered option - 1"));

    expect(screen.getByTestId("checkbox - selected option - 1")).toBeChecked();

    fireEvent.click(screen.getByTestId("checkbox - selected option - 1"));

    waitFor(() => {
      expect(
        screen.getByTestId("checkbox - filtered option - 1")
      ).not.toBeChecked();
    });

    expect(screen.queryByTestId("checkbox - selected option - 1")).toBeNull();
  });

  it("should sort selected options in an ascending order", () => {
    render(<MultiSelect title="Product groups" options={options} />);

    fireEvent.click(screen.getByTestId("checkbox - filtered option - 1"));
    fireEvent.click(screen.getByTestId("checkbox - filtered option - 2"));

    const selectedOptions = screen.getAllByRole("checkbox");

    expect(selectedOptions[0]).toHaveAttribute(
      "data-testid",
      "checkbox - selected option - 2"
    );
    expect(selectedOptions[1]).toHaveAttribute(
      "data-testid",
      "checkbox - selected option - 1"
    );
  });

  it("should store selected options in localStorage", () => {
    render(<MultiSelect title="Product groups" options={options} />);

    fireEvent.click(screen.getByTestId("checkbox - filtered option - 1"));
    fireEvent.click(screen.getByTestId("checkbox - filtered option - 2"));

    const cache = window.localStorage.getItem(
      "multiSelectCache - Product groups"
    );

    expect(cache).toEqual('["1","2"]');
  });

  it("should restore selected options from localStorage", () => {
    window.localStorage.setItem(
      "multiSelectCache - Product groups",
      '["1","2"]'
    );
    render(<MultiSelect title="Product groups" options={options} />);

    expect(screen.getByTestId("checkbox - selected option - 1")).toBeChecked();
    expect(screen.getByTestId("checkbox - selected option - 2")).toBeChecked();
  });

  it("should remove unselected option from localStorage", () => {
    window.localStorage.setItem(
      "multiSelectCache - Product groups",
      '["1","2"]'
    );
    render(<MultiSelect title="Product groups" options={options} />);

    fireEvent.click(screen.getByTestId("checkbox - selected option - 1"));

    const cache = window.localStorage.getItem(
      "multiSelectCache - Product groups"
    );
    expect(cache).toEqual('["2"]');
  });
});

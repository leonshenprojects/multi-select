import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import MultiSelect, {
  MultiSelectOption,
} from "../components/MultiSelect/MultiSelect";
import styles from "../styles/Home.module.scss";
import { ProductGroupData } from "./api/productGroups";

const Home: NextPage = () => {
  const { data, isLoading, error } = useQuery<ProductGroupData>(
    ["productGroups"],
    () => fetch("/api/productGroups").then((response) => response.json())
  );

  const productGroupOptions: Array<MultiSelectOption> =
    data?.productGroups.map((productGroup, index) => ({
      id: index.toString(),
      label: productGroup,
      value: productGroup,
    })) || [];

  return (
    <div className={styles.container}>
      <Head>
        <title>Product groups</title>
        <meta
          name="description"
          content="Multi-select filter for product groups."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MultiSelect
          title="Productgroep"
          options={productGroupOptions}
          loading={isLoading}
          isErrored={!!error}
        />
      </main>
    </div>
  );
};

export default Home;

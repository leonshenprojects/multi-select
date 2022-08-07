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
    data?.productGroups.map((productGroup) => ({
      label: productGroup,
      value: productGroup,
    })) || [];

  return (
    <div className={styles.container}>
      <Head>
        <title>Bol.com - Coding Challenge</title>
        <meta
          name="description"
          content="Multi-select filter for product groups."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Product group multi-select</h1>

        <div className={styles.productGroupSelector}>
          <MultiSelect
            title="Productgroep"
            options={productGroupOptions}
            loading={isLoading}
            isErrored={!!error}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;

import * as React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";

import "./index.css";

const Header = () => (
  <div
    style={{
      background: "rebeccapurple",
      marginBottom: "1.45rem"
    }}
  >
    <div
      style={{
        margin: "0 auto",
        maxWidth: 960,
        padding: "1.45rem 1.0875rem"
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          Feltyrion Explorer
        </Link>
      </h1>
    </div>
  </div>
);

interface DefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  children?: any;
}

export class DefaultLayout extends React.PureComponent<
  DefaultLayoutProps,
  any
> {
  public render() {
    return (
      <div>
        <Helmet
          title="Feltyrion Explorer"
          meta={[
            { name: "description", content: "Feltyrion Explorer" },
            { name: "keywords", content: "noctis, noctis iv, g.o.e.s." }
          ]}
        />
        <Header />
        <div
          style={{
            margin: "0 auto",
            maxWidth: 960,
            padding: "0px 1.0875rem 1.45rem",
            paddingTop: 0
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DefaultLayout;

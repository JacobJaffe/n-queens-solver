import { CodeBlock, Layouts } from "@template/components";

const HomePage: React.FC = () => (
  <Layouts.Basic>
    <h1 className="mt-4 mb-4 text-2xl">Template Site</h1>
    <p className="mt-3 mb-3 text-lg text-gray-500">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur minima sequi recusandae,
      porro maiores officia assumenda aliquam laborum ab aliquid veritatis impedit odit adipisci
      optio iste blanditiis facere. Totam, velit.
    </p>
    <CodeBlock json>
      {{
        foo: "bar",
      }}
    </CodeBlock>
  </Layouts.Basic>
);

export default HomePage;

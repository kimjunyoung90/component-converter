import {useState} from 'react';

const EXAMPLE_CLASS = `class ExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  handleClick = () => {
    this.setState(prev => ({
      count: prev.count + 1
    }));
  }

  render() {
    return (
      <div>
        <h1>Count: {this.state.count}</h1>
        <button onClick={this.handleClick}>
          Increment
        </button>
      </div>
    );
  }
}`;

const ClassToFunctionConverter = () => {

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const convertToFunction = (classCode) => {
    try {
      const functionComponent = classCode
          // constructor와 state 초기화를 useState로 변환
          .replace(
              /constructor\(props\)[\s\S]*?this\.state = {([\s\S]*?)};/gm,
              (_, stateContent) => {
                const states = stateContent.split(
                    /,[\s]*(?![^\[\]\{\}]*[\]\}])/)//배열이나 객체 내부가 아닌 곳의 쉼표를 찾아 분리
                    .map(s => s.trim()).filter(s => s).map(s => {
                      const [key, value] = s.split(':').map(p => p.trim());
                      return `const [${key}, set${key.charAt(0).toUpperCase() +
                      key.slice(1)}] = useState(${value});`;
                    }).join('\n  ');
                return states;
              },
          )
          // 클래스 선언을 함수형 컴포넌트로 변환
          .replace(
              /class (\w+) extends React\.Component[\s\S]*?{/,
              'const $1 = (props) => {',
          )
          // render 메서드 제거
          .replace(
              /render\s*\(\)\s*{([\s\S]*?return\s*\([\s\S]*?\);?)[\s\S]*?}/,
              '$1')
          // this.state 참조 제거
          .replace(/this\.state\./g, '')
          // setState를 useState setter로 변환
          .replace(
              /this\.setState\(\(?([^)]+)\)\)/g,
              (_, content) => {
                const stateHook = content.split(/,[\s]*(?![^\[\]\{\}]*[\]\}])/).
                    map(s => s.trim()).
                    filter(s => s).
                    map(s => {
                      const [key, value] = s.split(':').map(p => p.trim());
                      return `set${key.charAt(0).toUpperCase() +
                      key.slice(1)}(${value});`;
                    }).
                    join('\n      ');
                return stateHook;
              },
          )
          // componentDidMount를 useEffect로 변환
          .replace(
              /componentDidMount\s*?\(\)\s*?{([\s\S]*?)}/g,
              'useEffect(() => {$1}, [])',
          );

      setOutput(
          `import { useState, useEffect } from 'react';\n\n${functionComponent}`);
      setError('');
    } catch (err) {
      setError('코드 변환 중 오류가 발생했습니다. 입력 코드를 확인해주세요.');
    }
  };

  const handleLoadExample = () => {
    setInput(EXAMPLE_CLASS);
    setError('');
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output).then(() => {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 1000);
    });
    navigator.clipboard.writeText(output);
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setError('please input class component');
      return;
    }
    convertToFunction(input);
  };

  return (
      <>
        <div className="max-w-6xl mx-auto p-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              React Class → Function Converter
            </h1>
            <p className="text-gray-600">
              Let's convert class component to function component
            </p>
          </div>

          {error && (
              <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg shadow-sm">
              <div
                  className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold">Input: Class Component</h2>
                <button
                    onClick={handleLoadExample}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  Load Example
                </button>
              </div>
              <div className="p-4">
            <textarea
                className="w-full h-[500px] p-4 font-mono text-sm border rounded bg-gray-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="class component..."
            />
              </div>
            </div>

            <div className="border rounded-lg shadow-sm">
              <div
                  className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold">Output: Function Component</h2>
                {output && (
                    <button
                        onClick={handleCopyOutput}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                    >
                      Copy Code
                    </button>
                )}
              </div>
              <div className="p-4">
            <textarea
                className="w-full h-[500px] p-4 font-mono text-sm border rounded bg-gray-50"
                value={output}
                readOnly
                placeholder="function component..."
            />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
                onClick={handleConvert}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Convert to Function Component
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">available</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>constructor → useState</li>
              <li>componentDidMount → useEffect</li>
              <li>this.state → useState</li>
              <li>this.setState → useState setter</li>
              <li>method → arrow function</li>
            </ul>
          </div>
        </div>
        {
            showSnackbar && (
                <div
                    className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-400 text-white text-lg py-4 px-6 rounded shadow-lg">
                  copied!
                </div>
            )
        }
      </>
  );
};

export default ClassToFunctionConverter;
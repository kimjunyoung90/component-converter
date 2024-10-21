# React Class to Function Component Converter

This web application provides a simple interface for converting React class components into functional components. With the rise of hooks in React, converting class components to function components can enhance code readability and maintainability.

## Features

- Convert class components to functional components using `useState` and `useEffect`.
- Automatically refactor lifecycle methods into their functional counterparts.
- Supports transforming `this.state` into local state variables.
- Converts `this.setState` into the respective state setter functions.
- Methods are transformed into regular or arrow functions.

## Usage

1. **Input Class Component**: Paste your React class component code into the "Input: Class Component" textarea. You can also click the "Load Example" button to see a sample class component.

2. **Convert**: Click the "Convert to Function Component" button. The converted functional component will appear in the "Output: Function Component" textarea.

3. **Copy Output**: If you want to copy the converted code, simply click the "Copy Code" button next to the output textarea.

## Example

### Input:

```javascript
class ExampleComponent extends React.Component {
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
}
```
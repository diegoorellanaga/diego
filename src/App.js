import GameManager from "./core/GameManager";
import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('GameManager Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error">Game failed to load</div>;
    }
    return this.props.children;
  }
}


function App() {
  return (
    <div className="game-container">
      <GameManager />
    </div>
  );
}

export default App;
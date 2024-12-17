import styled from 'styled-components';
import Timeline from './timeline/ExampleTimeline';
import ExampleTimelineB from './timeline/ExampleTimelineB';

const StyledHeader = styled.h1`
  font-size: 30px;
  font-weight: 600;
`;

function App() {
  return <ExampleTimelineB />;
}

export default App;

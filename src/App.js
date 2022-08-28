'use strict';

function LengthControl({ label, labelId, length, lengthId, decId, incId, onClick }) {
  return (
    <div>
      <div id={labelId} className='label' >{label}</div>
      <div className="length-box">
        <button
          id={decId}
          className='btn'
          value='-'
          onClick={onClick}
        >
          <i className="fa-solid fa-arrow-down"></i>
        </button>
        <div id={lengthId} className='length'>{length}</div>
        <button
          id={incId}
          className='btn'
          value='+'
          onClick={onClick}
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>
  )
}



function App() {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timer, setTimer] = React.useState(1500);
  const [isRunning, setIsRunning] = React.useState(false);
  const [timerState, setTimerState] = React.useState('Session');

  const refAudio = React.useRef(null);


  function handleBreak(e) {

    if (isRunning) {
      return;
    }

    if (e.currentTarget.value === '-' && breakLength > 1) {

      setBreakLength(prevState => prevState - 1)

      if (timerState === 'Break') {
        setTimer(sessionLength * 60 - 60)
      }
    }

    if (e.currentTarget.value === '+' && breakLength < 60) {

      setBreakLength(prevState => prevState + 1)

      if (timerState === 'Break') {
        setTimer(sessionLength * 60 + 60)
      }
    }
  }


  function handleSession(e) {
    if (isRunning) {
      return;
    }

    if (e.currentTarget.value === '-' && sessionLength > 1) {

      setSessionLength(prevState => prevState - 1)

      if (timerState === 'Session') {
        setTimer(sessionLength * 60 - 60)
      }

    }

    if (e.currentTarget.value === '+' && sessionLength < 60) {

      setSessionLength(prevState => prevState + 1)

      if (timerState === 'Session') {
        setTimer(sessionLength * 60 + 60)
      }

    }
  }


  /*  
  this function can be improved using libaray or other technique to improve delay in interval this is common problem with setInteval and setTimeout 
  maybe in future will try to improve this project further  and add some features. Since it passes all test required to pass.
  Using something new need time to try and test which needs good amout of time which i dont have right.
  */
  function handlePlay() {
    if (!isRunning) {
      setIsRunning(!isRunning)

      let id = setInterval(() => {

        setTimer(prevState => {
          if (prevState === 0) {

            refAudio.current.currentTime = 0
            refAudio.current.play()

            setTimerState(prevState => prevState === 'Session' ? 'Break' : 'Session')

            return (timerState === 'Session' ? breakLength : sessionLength) * 60;

          } else {

            return prevState - 1
          }
        })

      }, 1000)

      localStorage.setItem('intervalId', id)
    } else {

      clearInterval(localStorage.getItem('intervalId'))
      setIsRunning(!isRunning)

    }
  }

  function handleReset() {

    clearInterval(localStorage.getItem('intervalId'))
    setBreakLength(5)
    setSessionLength(25)
    setTimer(1500)
    setTimerState('Session')
    setIsRunning(false)

    // stop and rewind back to start
    refAudio.current.pause();
    refAudio.current.currentTime = 0;

  }


  const formatDate = () => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds
  }

  return (
    <div className="container">
      <div className="length-control">

        <LengthControl
          label='Break Length'
          labelId='break-label'
          decId='break-decrement'
          incId='break-increment'
          lengthId='break-length'
          length={breakLength}
          onClick={handleBreak}
        />

        <LengthControl
          label='Session Length'
          labelId='session-label'
          decId='session-decrement'
          incId='session-increment'
          lengthId='session-length'
          length={sessionLength}
          onClick={handleSession}
        />

      </div>

      <div className="display">
        <div
          style={{ color: timerState === 'Session' ? 'green' : 'orange' }}
          id="timer-label"
          className='timer-label'
        >
          {timerState}
        </div>
        <div
          style={{ color: timer >= 60 ? 'white' : 'orangered' }}
          id="time-left"
          className='time-left'
        >
          {formatDate()}
        </div>
      </div>

      <div className="main-control">
        <button
          id="start_stop"
          className='btn btn-start-stop'
          onClick={handlePlay}
        >
          {
            !isRunning
              ? <i className="fa-solid fa-play"></i>
              : <i className="fa-solid fa-pause"></i>
          }

        </button>

        <button
          id="reset"
          className='btn btn-reset'
          onClick={handleReset}
        >
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>

      <audio
        id="beep"
        preload="auto"
        ref={refAudio}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
}



ReactDOM.render(<App />, document.getElementById('root'));
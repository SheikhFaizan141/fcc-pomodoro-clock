'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function LengthControl(_ref) {
  var label = _ref.label,
      labelId = _ref.labelId,
      length = _ref.length,
      lengthId = _ref.lengthId,
      decId = _ref.decId,
      incId = _ref.incId,
      onClick = _ref.onClick;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { id: labelId, className: 'label' },
      label
    ),
    React.createElement(
      'div',
      { className: 'length-box' },
      React.createElement(
        'button',
        {
          id: decId,
          className: 'btn',
          value: '-',
          onClick: onClick
        },
        React.createElement('i', { className: 'fa-solid fa-arrow-down' })
      ),
      React.createElement(
        'div',
        { id: lengthId, className: 'length' },
        length
      ),
      React.createElement(
        'button',
        {
          id: incId,
          className: 'btn',
          value: '+',
          onClick: onClick
        },
        React.createElement('i', { className: 'fa-solid fa-arrow-up' })
      )
    )
  );
}

function App() {
  var _React$useState = React.useState(5),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      breakLength = _React$useState2[0],
      setBreakLength = _React$useState2[1];

  var _React$useState3 = React.useState(25),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      sessionLength = _React$useState4[0],
      setSessionLength = _React$useState4[1];

  var _React$useState5 = React.useState(1500),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      timer = _React$useState6[0],
      setTimer = _React$useState6[1];

  var _React$useState7 = React.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      isRunning = _React$useState8[0],
      setIsRunning = _React$useState8[1];

  var _React$useState9 = React.useState('Session'),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      timerState = _React$useState10[0],
      setTimerState = _React$useState10[1];

  var refAudio = React.useRef(null);

  function handleBreak(e) {

    if (isRunning) {
      return;
    }

    if (e.currentTarget.value === '-' && breakLength > 1) {

      setBreakLength(function (prevState) {
        return prevState - 1;
      });

      if (timerState === 'Break') {
        setTimer(sessionLength * 60 - 60);
      }
    }

    if (e.currentTarget.value === '+' && breakLength < 60) {

      setBreakLength(function (prevState) {
        return prevState + 1;
      });

      if (timerState === 'Break') {
        setTimer(sessionLength * 60 + 60);
      }
    }
  }

  function handleSession(e) {
    if (isRunning) {
      return;
    }

    if (e.currentTarget.value === '-' && sessionLength > 1) {

      setSessionLength(function (prevState) {
        return prevState - 1;
      });

      if (timerState === 'Session') {
        setTimer(sessionLength * 60 - 60);
      }
    }

    if (e.currentTarget.value === '+' && sessionLength < 60) {

      setSessionLength(function (prevState) {
        return prevState + 1;
      });

      if (timerState === 'Session') {
        setTimer(sessionLength * 60 + 60);
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
      setIsRunning(!isRunning);

      var id = setInterval(function () {

        setTimer(function (prevState) {
          if (prevState === 0) {

            refAudio.current.currentTime = 0;
            refAudio.current.play();

            setTimerState(function (prevState) {
              return prevState === 'Session' ? 'Break' : 'Session';
            });

            return (timerState === 'Session' ? breakLength : sessionLength) * 60;
          } else {

            return prevState - 1;
          }
        });
      }, 1000);

      localStorage.setItem('intervalId', id);
    } else {

      clearInterval(localStorage.getItem('intervalId'));
      setIsRunning(!isRunning);
    }
  }

  function handleReset() {

    clearInterval(localStorage.getItem('intervalId'));
    setBreakLength(5);
    setSessionLength(25);
    setTimer(1500);
    setTimerState('Session');
    setIsRunning(false);

    // stop and rewind back to start
    refAudio.current.pause();
    refAudio.current.currentTime = 0;
  }

  var formatDate = function formatDate() {
    var minutes = Math.floor(timer / 60);
    var seconds = timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  };

  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'div',
      { className: 'length-control' },
      React.createElement(LengthControl, {
        label: 'Break Length',
        labelId: 'break-label',
        decId: 'break-decrement',
        incId: 'break-increment',
        lengthId: 'break-length',
        length: breakLength,
        onClick: handleBreak
      }),
      React.createElement(LengthControl, {
        label: 'Session Length',
        labelId: 'session-label',
        decId: 'session-decrement',
        incId: 'session-increment',
        lengthId: 'session-length',
        length: sessionLength,
        onClick: handleSession
      })
    ),
    React.createElement(
      'div',
      { className: 'display' },
      React.createElement(
        'div',
        {
          style: { color: timerState === 'Session' ? 'green' : 'orange' },
          id: 'timer-label',
          className: 'timer-label'
        },
        timerState
      ),
      React.createElement(
        'div',
        {
          style: { color: timer >= 60 ? 'white' : 'orangered' },
          id: 'time-left',
          className: 'time-left'
        },
        formatDate()
      )
    ),
    React.createElement(
      'div',
      { className: 'main-control' },
      React.createElement(
        'button',
        {
          id: 'start_stop',
          className: 'btn btn-start-stop',
          onClick: handlePlay
        },
        !isRunning ? React.createElement('i', { className: 'fa-solid fa-play' }) : React.createElement('i', { className: 'fa-solid fa-pause' })
      ),
      React.createElement(
        'button',
        {
          id: 'reset',
          className: 'btn btn-reset',
          onClick: handleReset
        },
        React.createElement('i', { className: 'fa-solid fa-arrows-rotate' })
      )
    ),
    React.createElement('audio', {
      id: 'beep',
      preload: 'auto',
      ref: refAudio,
      src: 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
    })
  );
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
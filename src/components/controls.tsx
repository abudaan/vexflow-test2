import React, { SyntheticEvent, useRef, RefObject } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { selectScore } from "../redux/actions/selectScore";
import { selectInterpretation } from "../redux/actions/selectInterpretation";
import uniqid from "uniqid";
import { uploadXMLDoc } from "../redux/actions/uploadXMLDoc";
import { uploadMIDIFile } from "../redux/actions/uploadMIDIFile";
import { AppDispatch, Transport, AppState } from "../types";
import { handleTransport } from "../redux/actions/handleTransport";
import { connectScoreAndInterpretation } from "../redux/actions/connect";
import { resetScore } from "../redux/actions/resetScore";

type Props = {};
export const Controls: React.FC<Props> = ({}: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const scoreNames = useSelector((state: AppState) => {
    return state.scores.map(val => val.name);
  }, shallowEqual);
  const interpretationNames = useSelector((state: AppState) => {
    return state.interpretations.map(val => val.name);
  }, shallowEqual);
  const selectedScoreIndex = useSelector((state: AppState) => state.selectedScoreIndex);
  const selectedInterpretationIndex = useSelector(
    (state: AppState) => state.selectedInterpretationIndex
  );
  const transport = useSelector((state: AppState) => state.transport);
  const scoreSelected = useSelector((state: AppState) => state.currentInterpretation !== null);

  const refs: { [id: string]: RefObject<HTMLInputElement> } = {
    mxml: useRef(),
    midi: useRef(),
  };

  const onClick = (type: string): void => {
    const ref = refs[type];
    if (ref.current) {
      ref.current.value = null;
      ref.current.click();
    }
  };

  const select1 = ["select MusicXML file", ...scoreNames];
  const select2 = ["select MIDI file", ...interpretationNames];

  console.log(`[Controls] render ${selectedScoreIndex} ${selectedInterpretationIndex}`);

  return (
    <div id="controls">
      <select
        value={selectedScoreIndex}
        onChange={e => {
          const index = e.target.selectedIndex;
          if (index === 0) {
            return;
          } else if (index !== selectedScoreIndex) {
            dispatch(selectScore(index));
          }
        }}
      >
        {select1.map((val, i) => (
          <option key={uniqid()} value={i}>
            {val}
          </option>
        ))}
      </select>

      <input
        ref={refs.mxml}
        type="file"
        id="upload"
        accept=".xml,.musicxml,.mxl,.mxml"
        style={{ display: "none" }}
        onChange={e => {
          const files = (event.target as HTMLInputElement).files;
          if (files && files[0]) {
            dispatch(uploadXMLDoc(files[0]));
          }
        }}
      />
      <button
        type="button"
        onClick={(): void => {
          onClick("mxml");
        }}
      >
        add mxml file
      </button>

      <select
        value={selectedInterpretationIndex}
        onChange={e => {
          const index = e.target.selectedIndex;
          if (index === 0) {
            return;
          } else if (index !== selectedInterpretationIndex) {
            dispatch(selectInterpretation(index));
          }
        }}
      >
        {select2.map((val, i) => (
          <option key={uniqid()} value={i}>
            {val}
          </option>
        ))}
      </select>

      <input
        ref={refs.midi}
        type="file"
        id="upload"
        accept=".mid,.midi"
        style={{ display: "none" }}
        onChange={(e: SyntheticEvent) => {
          const files = (event.target as HTMLInputElement).files;
          if (files && files[0]) {
            dispatch(uploadMIDIFile(files[0]));
          }
        }}
      />
      <button
        type="button"
        onClick={(): void => {
          onClick("midi");
        }}
      >
        add midi file
      </button>

      <input
        type="button"
        value="connect"
        disabled={selectedScoreIndex === 0 || selectedInterpretationIndex === 0}
        onClick={() => {
          dispatch(connectScoreAndInterpretation());
        }}
      />

      <input
        type="button"
        value={transport === Transport.PLAY ? "pause" : "play"}
        disabled={!scoreSelected}
        onClick={() => {
          dispatch(
            handleTransport(transport === Transport.PLAY ? Transport.PAUSE : Transport.PLAY)
          );
        }}
      />
      <input
        type="button"
        value="stop"
        disabled={!scoreSelected}
        onClick={() => {
          dispatch(handleTransport(Transport.STOP));
        }}
      />
      <input
        type="button"
        value="reset score"
        disabled={!scoreSelected}
        onClick={() => {
          dispatch(resetScore());
        }}
      />
    </div>
  );
};

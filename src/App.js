import React, { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Input, Typography, Select } from "antd";
import countapi from "countapi-js";
import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import FormControlLabel from "@material-ui/core/FormControlLabel";

import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import Switch from "@material-ui/core/Switch";

function App() {
  const [questions, setQuestions] = useState([]);

  const [option, setOption] = useState("Short Answer");

  const [optionText, setOptionText] = useState("shortanswer");
  const [multiple, setMultiple] = useState(false);
  const { Option } = Select;

  useEffect(() => {
    var newQuestion = {
      id: "1",
      question: "Question",
      type: "text",
      options: [{ option: optionText }],
      open: true,
      required: false,
    };
    countapi.visits("global").then((result) => {
      console.log(result.value);
    });
    setQuestions([...questions, newQuestion]);
  }, []);

  function changeOptionText(i, type) {
    let temp_state = [...questions];

    let temp_element = { ...temp_state[i] };

    if (type === "shortanswer") {
      temp_element.options[0].option = "Short answer";
    } else {
      temp_element.options[0].option = "Option";
    }

    temp_state[i] = temp_element;

    setQuestions(temp_state);
  }

  function requiredQuestion(i) {
    var requiredQuestion = [...questions];

    requiredQuestion[i].required = !requiredQuestion[i].required;

    console.log(requiredQuestion[i].required + " " + i);
    setQuestions(requiredQuestion);
    console.log(questions);
  }

  function addQuestionType(i, type, index) {
    if (type === "shortanswer") {
      setOptionText("Short answer");
    } else {
      setOptionText("Option");
    }
    if (type === "radio") {
      setMultiple(true);
    } else {
      setMultiple(false);
    }
    let qs = [...questions];

    if (type !== undefined && type !== "shortanswer") {
      qs[i].type = type;
    } else if (type === "shortanswer") {
      qs[i].type = "text";
    }
    setQuestions(qs);
  }

  function addMoreQuestionField() {
    setOptionText("Short answer");
    expandCloseAll();

    setQuestions((questions) => [
      ...questions,
      {
        id: questions.length,
        question: "Question",
        type: "text",
        options: [{ option: optionText }],
        open: true,
        required: false,
      },
    ]);
  }

  function copyQuestion(i) {
    expandCloseAll();
    let qs = [...questions];
    var newQuestion = qs[i];

    setQuestions([...questions, newQuestion]);
  }

  function deleteQuestion(i) {
    let qs = [...questions];
    if (questions.length > 1) {
      qs.splice(i, 1);
    }
    setQuestions(qs);
  }

  function handleOptionValue(text, i, j) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].options[j].option = text;

    setQuestions(optionsOfQuestion);
  }

  function handleQuestionValue(text, i) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].question = text;
    setQuestions(optionsOfQuestion);
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    var itemgg = [...questions];
    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );
    setQuestions(itemF);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function addOption(i) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length < 5) {
      optionsOfQuestion[i].options.push({
        option: optionText,
      });
    } else {
      console.log("Max  5 options ");
    }
    //console.log(optionsOfQuestion);
    setOptionText("");
    setQuestions(optionsOfQuestion);
  }

  function removeOption(i, j) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length > 1) {
      optionsOfQuestion[i].options.splice(j, 1);
      setQuestions(optionsOfQuestion);
      console.log(i + "__" + j);
    }
  }

  function expandCloseAll() {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      qs[j].open = false;
    }
    setQuestions(qs);
  }

  function handleExpand(i) {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      if (i === j) {
        qs[i].open = true;
      } else {
        qs[j].open = false;
      }
    }
    setQuestions(qs);
  }

  function questionsUI() {
    return questions.map((ques, i) => (
      <Draggable key={i} draggableId={i + "id"} index={i}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
              <div style={{ marginBottom: "0px" }}>
                <div style={{ width: "100%", marginBottom: "0px" }}>
                  <DragIndicatorIcon
                    style={{
                      transform: "rotate(-90deg)",
                      color: "#DAE0E2",
                      position: "relative",
                      left: "300px",
                    }}
                    fontSize="small"
                  />
                </div>

                <Accordion
                  onChange={() => {
                    handleExpand(i);
                  }}
                  expanded={questions[i].open}
                  className={questions[i].open ? "add_border" : ""}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    elevation={1}
                    style={{ width: "100%" }}
                  >
                    {!questions[i].open ? (
                      <div className="saved_questions">
                        <Typography
                          style={{
                            fontSize: "15px",
                            fontWeight: "400",
                            letterSpacing: ".1px",
                            lineHeight: "24px",
                            paddingBottom: "8px",
                          }}
                        >
                          {i + 1}. {ques.question}
                          <span style={{ color: "red" }}>
                            {ques.required ? "*" : null}
                          </span>
                        </Typography>

                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div style={{ display: "flex" }}>
                              <FormControlLabel
                                style={{
                                  marginLeft: "5px",
                                  marginBottom: "5px",
                                }}
                                disabled
                                control={
                                  ques.type !== "text" ? (
                                    <input
                                      type={ques.type}
                                      color="primary"
                                      style={{ marginRight: "3px" }}
                                      required={ques.required}
                                    />
                                  ) : (
                                    <></>
                                  )
                                }
                                label={
                                  <Typography
                                    style={{
                                      fontFamily: " Roboto,Arial,sans-serif",
                                      fontSize: " 13px",
                                      fontWeight: "400",
                                      letterSpacing: ".2px",
                                      lineHeight: "20px",
                                      color: "#202124",
                                    }}
                                  >
                                    {ques.options[j].option}
                                  </Typography>
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </AccordionSummary>
                  <div className="question_boxes">
                    {!ques.answer ? (
                      <AccordionDetails className="add_question">
                        <div>
                          <div
                            className="add_question_top"
                            style={{ marginTop: -25 }}
                          >
                            <Input
                              type="text"
                              placeholder="Question"
                              value={ques.question}
                              onChange={(e) => {
                                handleQuestionValue(e.target.value, i);
                              }}
                              style={{ width: 420 }}
                            />

                            <Select
                              style={{ width: 200, marginLeft: "4px" }}
                              onChange={(value) => {
                                if (value === "shortanswer") {
                                  setOption("Short Answer");
                                } else if (value === "checkbox") {
                                  setOption("CheckBox");
                                } else {
                                  setOption("Multiple Choice");
                                }
                                addQuestionType(i, value);
                                changeOptionText(i, value);
                                console.log(value);
                              }}
                              value={option}
                            >
                              <Option value="shortanswer">
                                {" "}
                                {/* <AlignCenterOutlined
                                  style={{ marginRight: "10px" }}
                                />{" "} */}
                                Short Answers
                              </Option>

                              <Option value="checkbox">
                                {/* <CheckSquareOutlined
                                  style={{
                                    marginRight: "10px",
                                  }}
                                  checked
                                />{" "} */}
                                Checkboxes
                              </Option>
                              <Option value="radio">
                                {" "}
                                {/* <Radio checked />  */}
                                Multiple Choice
                              </Option>
                            </Select>
                          </div>

                          {ques.options.map((op, j) => (
                            <div className="add_question_body" key={j}>
                              {(ques.type === "radio" && multiple) ||
                              ques.type === "checkbox" ? (
                                <input
                                  type={ques.type}
                                  style={{
                                    marginTop: "10px",
                                  }}
                                  required={ques.required}
                                />
                              ) : (
                                <AlignLeftOutlined style={{ marginTop: 20 }} />
                              )}
                              <div>
                                <Input
                                  type="text"
                                  className="text_input"
                                  placeholder={
                                    (ques.type === "radio" && multiple) ||
                                    ques.type === "checkbox"
                                      ? "Option"
                                      : "Short Answer"
                                  }
                                  onChange={(e) => {
                                    handleOptionValue(e.target.value, i, j);
                                  }}
                                  style={{
                                    marginTop: "10px",
                                    height: 30,
                                    marginLeft: "4px",
                                  }}
                                />
                              </div>
                              {ques.type !== "text" && j !== 0 ? (
                                <CloseOutlined
                                  onClick={() => {
                                    removeOption(i, j);
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color: "#5f6368",
                                    marginLeft: "2px",
                                    marginTop: "8px",
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                          ))}

                          {ques.options.length < 5 ? (
                            <div className="add_question_body">
                              <FormControlLabel
                                disabled
                                control={
                                  ques.type === "radio" ||
                                  ques.type === "checkbox" ? (
                                    <Input
                                      type={ques.type}
                                      color="primary"
                                      style={{
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                      }}
                                    />
                                  ) : (
                                    <span></span>
                                  )
                                }
                                label={
                                  (ques.type === "radio" && multiple) ||
                                  ques.type === "checkbox" ? (
                                    <div>
                                      <Button
                                        type="primary"
                                        onClick={() => {
                                          addOption(i);
                                        }}
                                        style={{
                                          height: 30,
                                          marginTop: "4px",
                                        }}
                                      >
                                        Add Option
                                      </Button>
                                    </div>
                                  ) : null
                                }
                              />
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="add_footer">
                            <div className="add_question_bottom_left"></div>
                            <div className="add_question_bottom">
                              <CopyOutlined
                                onClick={() => {
                                  copyQuestion(i);
                                }}
                                style={{ fontSize: "22px", color: "#5f6368" }}
                              />
                              <DeleteOutlined
                                onClick={() => {
                                  deleteQuestion(i);
                                }}
                                style={{
                                  fontSize: "22px",
                                  marginLeft: "10px",
                                  color: "#5f6368",
                                }}
                              />
                              <span
                                style={{
                                  color: "#5f6368",
                                  fontSize: "13px",
                                  marginLeft: "10px",
                                }}
                              >
                                Required{" "}
                              </span>{" "}
                              <Switch
                                name="checkedA"
                                color="primary"
                                checked={ques.required}
                                onChange={() => {
                                  requiredQuestion(i);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    ) : (
                      <></>
                    )}
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    ));
  }

  return (
    <div>
      <div className="question_form">
        <br></br>
        <div className="section">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <h1 style={{ textAlign: "center" }} className="heading">
                    Made with ❤️ by Rohit Patil
                  </h1>
                  {questionsUI()}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="save_form">
            <Button
              type="primary"
              size="medium"
              onClick={() => console.log("clicked")}
              style={{ fontSize: "14px" }}
            >
              Save
            </Button>
            <Button
              type="primary"
              size="medium"
              onClick={addMoreQuestionField}
              style={{ fontSize: "14px", marginLeft: "8px" }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

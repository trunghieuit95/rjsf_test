import React, { useState, useEffect } from "react";
import axios from 'axios';

import Form from "@rjsf/core";

import _ from "lodash";

function validate(formData, errors) {
    // if (formData.pass1 !== formData.pass2) {
    //   errors.pass2.addError("Passwords don't match");
    // }
    console.log(formData);
    return errors;
  }
  
  const  mongoObjectId = () => {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  };
  
  const postSchema = {
    title: "Thông tin học sinh",
    type: "array",
    items: {
      type: "object",
      properties: {
        studentName: {
          title: "Tên học sinh",
          type: "string",
          minLength: 12,
          // required: true,
          messages: {
            // required: "Please enter your First name",
            minLength: "First name should be > 12 characters",
          },
        },
        studentPoint: {
          title: "Điểm",
          type: "string",
        },
        studentComment: {
          title: "Comment",
          type: "string",
        },
        youtubeId: {
          title: "ID youtube",
          type: "string",
          subType: "youtube",
        },
        avatarStudent: {
          title: "Ảnh đại diện",
          type: "string",
          subType: "upload",
        },
      },
      required: ["studentName", "studentPoint", "studentComment"],
    },
    customMessage: {
      studentName: {
        required: "Không được bỏ trống",
      },
    },
  };
  const ex2 = {
    title: "Thông tin môn",
    type: "array",
    level: 1,
    titleButton: "môn",
    items: {
      type: "object",
      showLess: true,
      properties: {
        id: {
          title: "id",
          type: "string",
          subType: "id"
        },
        subjectName: {
          title: "Tên môn",
          type: "string",
          display_in_collapse: true,
        },
        detail: {
          title: "Thông tin giáo viên",
          type: "array",
          titleButton: "giáo viên",
          items: {
            type: "object",
            showLess: true,
            properties: {
              id: {
                title: "id",
                type: "string",
                subType: "id"
              },
              teacherName: {
                title: "Tên giáo viên",
                type: "string",
                display_in_collapse: true,
              },
              courseNumber: {
                title: "Số khóa học",
                type: "string",
              },
              followNumber: {
                title: "Số học sinh theo dõi",
                type: "string",
              },
              infoDetail: {
                type: "array",
                title: "Mô tả",
                titleButton: "mô tả",
                items: {
                  type: "object",
                  properties: {
                      description: {
                          type: "string",
                          title: ""
                      },
                      id: {
                        title: "id",
                        type: "string",
                        subType: "id"
                      },
                  }
                },
              },
              youtubeId: {
                title: "ID youtube",
                type: "string",
                subType: "youtube",
              },
              avatarTeacher: {
                title: "Ảnh đại diện",
                type: "string",
                subType: "upload",
              },
            },
          },
        },
      },
    },
    // required: ["studentName", "studentPoint", "studentComment"]
  };
  
  const dataTest = [
    {
      detail: [
        {teacherName:"thầy chí"}
      ], 
      subjectName: "toán",
      id: "5f0596c0f4d5c47d2d8990f0"
    }
  ]
  const onSubmit = (val) => {
    console.log("submit");
    console.log(val);
    let data = val.formData;
    axios.post('http://localhost:3009/api/demo',{data})
        .then(res => {
          console.log(res);
          // const persons = res.data;
          // this.setState({ persons });
        })
  };
  
  const getYoutubeId = (url) => {
    let youtubeId = null;
    var regExp = /^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/;
    var match = url.match(regExp);
    youtubeId = match && match[1] ? match[1] : "";
    console.log(youtubeId);
  
    return youtubeId;
  };
  
  function transformErrors(errors) {
    console.log(errors);
    return errors.map((error) => {
      // console.log(error);
      if (error.name === "required") {
        error.message = "Không được bỏ trống";
      }
      return error;
    });
  }
  
  const uiSchema = {
    // "ui:options": {
    //   label: false
    // },
    "ui:widget": "text",
    id: {"ui:widget": "hidden"}
  };
  
  function ErrorListTemplate(props) {
    console.log(props);
    const { errors } = props;
    return (
      <div>
        <h2>Custom error list</h2>
        <ul>
          {errors.map((error) => (
            <li key={error.stack}>{error.stack}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  const UploadComponent = (props) => {
    console.log(props);
    // console.log(props.data);
    const [imgSrc, setImgSrc] = useState(props.data.value);
    const [imgUrl, setImgUrl] = useState(props.data.value);
    return (
      <div>
        <input
          type="text"
          style={{ width: "50%", display: "inline" }}
          id={props.data.id}
          label={props.data.label}
          placeholder={props.data.placeholder}
          value={imgUrl || ""}
          required={props.required}
          onChange={(event) => {
            if (event.target.value) {
              setImgSrc(event.target.value);
              props.data.onChange(event.target.value);
              setImgUrl(event.target.value);
            }
          }}
        />
        <input
          type="file"
          style={{ width: "50%", display: "inline" }}
          onChange={(event) => {
            if (event.target.files[0]) {
              setImgSrc(URL.createObjectURL(event.target.files[0]));
              props.data.onChange(event.target.files[0].name);
              setImgUrl(event.target.files[0].name);
            }
          }}
        />
        {imgSrc ? (
          <img
            width="50%"
            src={imgSrc ? imgSrc : "no-img"}
            alt="preview-upload"
          />
        ) : (
          ""
        )}
      </div>
    );
  };
  
  const YoutubeIDComponent = (props) => {
    // console.log(props);
    // console.log(props.data);
    // const [youtubeId, setYoutubeId] = useState();
    return (
      <input
        className="form-control"
        id={props.data.id}
        label={props.data.label}
        placeholder={props.data.placeholder}
        onChange={(e) => props.data.onChange(e.target.value)}
        onBlur={(e) => {
          if (e.target.value) {
            let youtubeId = getYoutubeId(e.target.value);
            props.data.onChange("https://www.youtube.com/watch?v=" + youtubeId);
          }
        }}
        type="text"
        value={props.data.value || ""}
      />
    );
  };
  
  const CustomFile = (props) => {
    return <UploadComponent data={props} />;
  };
  
  const CustomTextField = (props) => {
    console.log(props);
    const objId = mongoObjectId();
    if (
      props.schema &&
      props.schema.subType &&
      props.schema.subType === "youtube"
    ) {
      return (
        <div className="form-group row">
          {props.label ? (
            <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
              {props.label}
            </label>
          ) : null}
          <div className={props.label ? "col-sm-10" : "col-sm-12"}>
            <YoutubeIDComponent data={props} />
          </div>
        </div>
      );
    } else if (
      props.schema &&
      props.schema.subType &&
      props.schema.subType === "upload"
    ) {
      return (
        <div className="form-group row">
          {props.label ? (
            <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
              {props.label}
            </label>
          ) : null}
          <div className={props.label ? "col-sm-10" : "col-sm-12"}>
            <UploadComponent data={props} />
          </div>
        </div>
      );
    } else if (
      props.schema &&
      props.schema.subType &&
      props.schema.subType === "id"
    ) {
      if(!props.value){
        console.log(objId);
        props.onChange(objId)
      }
      return (
        <input
            className="form-control"
            id={props.id}
            label={props.label}
            placeholder={props.placeholder}
            onChange={(e) => props.onChange(e.target.value)}
            type="hidden"
            value={props.value || objId}
          />
      )
    }
    return (
      <div className="form-group row">
        {props.label ? (
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            {props.label}
          </label>
        ) : null}
        <div className={props.label ? "col-sm-10" : "col-sm-12"}>
          <input
            className="form-control"
            id={props.id}
            label={props.label}
            placeholder={props.placeholder}
            onChange={(e) => props.onChange(e.target.value)}
            type="text"
            value={props.value || ""}
          />
        </div>
      </div>
    );
  };
  
  const widgets = {
    FileWidget: CustomFile,
    TextWidget: CustomTextField,
  };
  
  function ArrayFieldTemplate(props) {
    // if(props.schema.level===1){
    // console.log(props);
    // }
    const [statusList, setStatusList] = useState([]);
    const [numberItem, setNumberItem] = useState(0);
    const styleLevel = [
      {
        background: "#e3f2fd",
        padding: "10px",
      },
      {
        background: "#bbdefb",
        marginLeft: "10px",
        padding: "10px",
      },
      {
        background: "#90caf9",
        marginLeft: "20px",
        padding: "10px",
      },
      {
        background: "#64b5f6",
        marginLeft: "30px",
        padding: "10px",
      },
      {
        background: "#42a5f5",
        marginLeft: "40px",
        padding: "10px",
      },
    ];
  
    useEffect(() => {
      if (props.items.length > 0) {
        if (props.items.length > numberItem) {
          // add
          console.log("add item");
          let newStatus = statusList;
          // an cac phan tu dang hien
          if (props.items.length > 1) {
            for (let i = 0; i < statusList.length; i++) {
              newStatus[i].display = false;
            }
          }
          newStatus.push({ display: true });
          setStatusList(newStatus);
        } else if (props.items.length < numberItem) {
          // remove
          console.log("delete item");
        }
        setNumberItem(props.items.length);
      }
    }, [props.items]);
  
    const updateStatus = (status, index) => {
      let newData = _.clone(statusList);
      newData[index].display = status;
      setStatusList(newData);
    };
  
    const removeStatus = (index) => {
      let newData = _.clone(statusList);
      newData.splice(index, 1);
      setStatusList(newData);
    };
  
    const detectLevel = (data) => {
      let x = data.split("_");
      if (Math.floor(x.length / 2) + 1 > 6) {
        return 5;
      }
      return Math.floor(x.length / 2) + 1;
    };
  
    const getFieldShowCollapse = (data, formData) => {
      // console.log(Object.keys(data));
      // console.log(formData);
      let listKey = Object.keys(data);
      let dataShowLess = JSON.stringify(formData);
      for (let i = 0; i < listKey.length; i++) {
        if (data[listKey[i]].display_in_collapse) {
          console.log(data[listKey[i]]);
          console.log(data[listKey[i]].title + " : " + formData[listKey[i]]);
          dataShowLess =
            data[listKey[i]].title +
            " : " +
            (formData[listKey[i]] ? formData[listKey[i]] : "Chưa nhập");
          break;
        }
      }
      return dataShowLess;
    };
  
    return (
      <div
        className={props.className}
        style={styleLevel[detectLevel(props.idSchema.$id) - 1]}
      >
        <h2>{props.title}</h2>
        {/* <h3>level : {detectLevel(props.idSchema.$id)}</h3> */}
        {props.items &&
          props.items.map((element, index) => (
            <div key={element.key} className={element.className}>
              {statusList[index] && statusList[index].display ? (
                <div>{element.children}</div>
              ) : (
                // <div style={{maxHeight:'80px',overflow:'hidden'}}>{element.children}</div>
                <div>
                  {statusList[index] && element.children.props.schema.showLess ? (
                    getFieldShowCollapse(
                      element.children.props.schema.properties,
                      element.children.props.formData
                    )
                  ) : (
                    <div>{element.children}</div>
                  )}
                </div>
              )}
              {/* {element.hasMoveDown && (
                <button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index + 1
                  )}>
                  Down
                </button>
              )}
              {element.hasMoveUp && (
                <button
                  onClick={element.onReorderClick(
                    element.index,
                    element.index - 1
                  )}>
                  Up
                </button>
              )} */}
              {statusList[index] && element.children.props.schema.showLess ? (
                <button
                  className="btn btn-warning"
                  type="button"
                  onClick={() =>
                    updateStatus(!statusList[index].display, element.index)
                  }
                >
                  {statusList[index].display ? "Ẩn bớt" : "Chi tiết"}
                </button>
              ) : (
                ""
              )}
              <button
                type="button"
                onClick={element.onDropIndexClick(element.index)}
                className="btn btn-danger"
              >
                <span onClick={() => removeStatus(element.index)}>
                  {"Xóa " + (props.schema.titleButton ? props.schema.titleButton : '')}
                </span>
              </button>
              <hr />
            </div>
          ))}
  
        {props.canAdd && (
          <div className="row">
            <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
              <button
                onClick={(e) => props.onAddClick(e)}
                type="button"
                className="btn btn-primary"
              >
                {"Thêm " + (props.schema.titleButton ? props.schema.titleButton : '')}
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }
  
  function CustomFieldTemplate(props) {
    const {
      id,
      classNames,
      label,
      help,
      required,
      description,
      errors,
      children,
    } = props;
    console.log(props);
    return (
      <div className={classNames}>
        {/* {label ? (props.schema.level === 1 ? <h1>{label}</h1> : <label htmlFor={id}>{label}{required ? "*" : null}</label>) : null} */}
        {/* <div> */}
        {description}
        {children}
        {errors}
        {help}
        {/* </div> */}
      </div>
    );
  }

  function Create() {
    const [schemaConfig, setSchemaConfig] = useState(ex2);

    const transformErrors2 = (errors, data) => {
      // console.log(errors,data);
      return errors.map((error) => {
        if (data) {
          let customMessage = data[error.params.missingProperty];
          if (customMessage) {
            error.message = customMessage[error.name];
            console.log(error);
          }
        }
        return error;
      });
    };
  
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <Form
              onSubmit={onSubmit}
              schema={schemaConfig}
              // onError={onError}
              uiSchema={uiSchema}
              widgets={widgets}
              validate={validate}
              transformErrors={(errors) =>
                transformErrors2(errors, schemaConfig.customMessage)
              }
              FieldTemplate={CustomFieldTemplate}
              ArrayFieldTemplate={ArrayFieldTemplate}
              // formData={dataTest}
              // ErrorList={ErrorListTemplate}
            >
              <div>
                <button type="submit" className="btn btn-success">
                  Gửi
                </button>
                {/* <button type="button">Cancel</button> */}
              </div>
            </Form>
          </div>
          <div className="col-md-4">
            <button onClick={() => setSchemaConfig(postSchema)}>Ex1</button>
            <button onClick={() => setSchemaConfig(ex2)}>Ex2</button>
          </div>
        </div>
      </div>
    )
  }

  export default Create;
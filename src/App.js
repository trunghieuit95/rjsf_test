import React, { useState,useEffect } from "react";
// import logo from './logo.svg';
// import './App.css';
import Form from "@rjsf/core";
// import JSONSchemaForm from "react-jsonschema-form";

function validate(formData, errors) {
  // if (formData.pass1 !== formData.pass2) {
  //   errors.pass2.addError("Passwords don't match");
  // }
  console.log(formData);
  return errors;
}

const postSchema = {
  title: "Thông tin học sinh",
  type: "array",
  items: {
    type: "object",
    properties: {
      studentName: {
        title: "Tên học sinh",
        type: "string",
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
};
const ex2 = {
  title: "Thông tin môn",
  type: "array",
  level: 1,
  items: {
    type: "object",
    properties: {
      subjectName: {
        title: "Tên môn",
        type: "string",
      },
      detail: {
        title: "Thông tin giáo viên",
        type: "array",
        items: {
          type: "object",
          properties: {
            teacherName: {
              title: "Tên giáo viên",
              type: "string",
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
              items: {
                type: "string",
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
const onSubmit = (val) => {
  console.log("submit");
  console.log(val);
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
    if (error.name === "pattern") {
      error.message = "Only digits are allowed";
    }
    return error;
  });
}

const uiSchema = {
  // test : {
  //   "ui:widget": (props) => {
  //     return (
  //       <UploadComponent props={props} />
  //     );
  //   }
  // },
  "ui:widget": "text",
};

const UploadComponent = (props) => {
  // console.log(props);
  // console.log(props.data);
  const [imgSrc, setImgSrc] = useState();
  const [imgUrl,setImgUrl] = useState();
  return (
    <div>
      <input 
      type="text" style={{width:"50%",display:"inline"}}
      id={props.data.id}
        label={props.data.label}
        placeholder={props.data.placeholder}
        value={imgUrl || ''}
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
        style={{width:"50%",display:"inline"}}
        onChange={(event) => {
          if (event.target.files[0]) {
            setImgSrc(URL.createObjectURL(event.target.files[0]));
            props.data.onChange(event.target.files[0].name);
            setImgUrl(event.target.files[0].name);
          }
        }}
      />
      {imgSrc ? (
        <img width="50%" src={imgSrc ? imgSrc : "no-img"} alt="preview-upload" />
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
          props.data.onChange("https://www.youtube.com/watch?v="+youtubeId);
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
  // console.log(props);
  if (
    props.schema &&
    props.schema.subType &&
    props.schema.subType === "youtube"
  ) {
    return <YoutubeIDComponent data={props} />;
  } else if (
    props.schema &&
    props.schema.subType &&
    props.schema.subType === "upload"
  ) {
    return <UploadComponent data={props} />;
  }
  return (
    <input
      className="form-control"
      id={props.id}
      label={props.label}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
      type="text"
      // value={props.value || ''}
    />
  );
};

const widgets = {
  FileWidget: CustomFile,
  TextWidget: CustomTextField,
};

function ArrayFieldTemplate(props) {
  if(props.schema.level===1){
    // console.log(props);
  }
  const [statusList,setStatusList] = useState([]);
  const [numberItem,setNumberItem] = useState(0);

  useEffect(() => {
    if(props.items.length > 0){
      if(props.items.length > numberItem){// add
        console.log('add item');
        let x = {display:true};
        // x.data = props.items[props.items.length-1];
        let newStatus = statusList;
        // an cac phan tu dang hien
        if(props.items.length > 1){
          for(let i=0;i<statusList.length;i++){
            newStatus[i].display = false;
          }
        }
        newStatus.push(x);
        console.log(newStatus);
        setStatusList(newStatus);
      } else if(props.items.length < numberItem){// remove
        console.log('delete item');
      }
      setNumberItem(props.items.length);
    }
  }, [props.items]);

  return (
    <div className={props.className}>
      <h2>{props.schema.title}</h2>
      {props.items &&
        props.items.map((element,index) => (
          <div key={element.key} className={element.className}>
            {
              statusList[index] && statusList[index].display ? <div>{element.children}</div> : <div>đã ẩn</div>
            }
            <h1>{index + ' : ' + JSON.stringify(statusList[index])}</h1>
            {/* <div>{element.children}</div> */}
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
            {/* <button onClick={element.data.onDropIndexClick(element.data.index)}>
              Delete
            </button> */}
            <button type="button" onClick={element.onDropIndexClick(element.index)}>
              <span onClick={() => console.log(element.index)}>Delete</span>
            </button>
            <hr />
          </div>
        ))}

      {props.canAdd && (
        <div className="row">
          <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
            <button onClick={(e) => props.onAddClick(e)} type="button">
              Custom +
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

function App() {
  const [schemaConfig, setSchemaConfig] = useState(ex2);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <Form
            onSubmit={onSubmit}
            schema={schemaConfig}
            uiSchema={uiSchema}
            widgets={widgets}
            validate={validate}
            transformErrors={transformErrors}
            ArrayFieldTemplate={ArrayFieldTemplate}
          />
        </div>
        <div className="col-md-6">
          <button onClick={() => setSchemaConfig(postSchema)}>Ex1</button>
          <button onClick={() => setSchemaConfig(ex2)}>Ex2</button>
        </div>
      </div>
    </div>
  );
}

export default App;

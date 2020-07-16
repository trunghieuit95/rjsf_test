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
    // let data = val.formData;
    // axios.post('http://localhost:3009/api/demo',{data})
    //     .then(res => {
    //       console.log(res);
    //       // const persons = res.data;
    //       // this.setState({ persons });
    //     })
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
    // console.log(props);
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
    } 
    else if (
      props.schema &&
      props.schema.subType &&
      props.schema.subType === "id"
    ) {
      // if(!props.value){
      //   console.log(objId);
      //   props.onChange(objId)
      // }
      return (
        <input
            className="form-control"
            id={props.id}
            label={props.label}
            placeholder={props.placeholder}
            // onChange={props.onChange(objId)}
            // type="hidden"
            defaultValue={objId}
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


  function Edit() {
    const [schemaConfig, setSchemaConfig] = useState(ex2);
    const [dataRes, setDataRes] = useState(null);
    const [dataObj, setDataObj] = useState(null);

    const findById = (id,obj,query = '', arrayObj = {}, propertyName = 'data', originData = {}) => {
        let newQuery = query;
        let listKey = Object.keys(obj);
        let res = '';
        // console.log(obj);
        originData = obj;
        console.log(originData);
        for(let j=0;j<listKey.length;j++){
            if(Array.isArray(obj[listKey[j]])){
                if(query){
                    newQuery = newQuery + '.' + listKey[j];
                } else {
                    newQuery = listKey[j];
                }
                if(obj.id){
                  arrayObj[propertyName] = obj.id;
                  // console.log(listKey[j]);
                  // console.log(a);
                }
                // processArray(id,obj[listKey[j]],newQuery);
                for(let i=0;i<obj[listKey[j]].length;i++){
                    if(id === obj[listKey[j]][i].id){
                      // newQuery = newQuery + '.' + id;
                      // console.log(listKey[j]);
                      originData = obj[listKey[j]][i];
                      arrayObj[listKey[j]] = id;
                      let result = {
                        query: newQuery,
                        arrayObj: arrayObj,
                        originData: originData
                      }
                      res = result;
                    } else {
                      // originData = obj[listKey[j]][i];
                      if(obj.id){
                        propertyName = listKey[j];
                        res = findById(id,obj[listKey[j]][i],newQuery, arrayObj, propertyName, originData[j]);
                      } else {
                        res = findById(id,obj[listKey[j]][i],newQuery, arrayObj, propertyName, originData[j]);
                      }
                    }
                    if (res) {
                      return res;
                    }
                }
            }
        }

        return null;
      }
    
    const updateData = (condition,data) => {
      // codition process
      let query = '';
      let arrayFilters = [];
      let conditionArray = condition.arrayObj;
      let arrQuery = [];
      // const listkey = Object.keys(conditionArray);
      const originData = condition.originData;
      let p1 = processQuery(conditionArray);
      query = p1.q;
      arrayFilters = p1.a;
      // for(let i=0;i<listkey.length;i++){
      //   // console.log(listkey[i]);
      //   if(i!==listkey.length-1){
      //     query = query + listkey[i] + '.$[' + listkey[i] + 'Item].';
      //   } else {
      //     query = query + listkey[i] + '.$[' + listkey[i] + 'Item]';
      //   }
      //   let arrayFilterItem = {[listkey[i] + 'Item.id']:conditionArray[listkey[i]]};
      //   arrayFilters.push(arrayFilterItem);
      // }
      // console.log(arrayFilters);
      // console.log(dataRes[0][z]);
      console.log(data);
      console.log(originData);
      console.log(JSON.stringify(data) === JSON.stringify(originData));
      // console.log(condition.split("."));
      // let x = condition.split(".");
      // x.pop();
      // if(){

      // }
      const resultCompare = compareObject(originData,data);
      console.log(resultCompare); 
      for(let i=0;i<resultCompare.length;i++){
        let itemArrQuery = {}
        let newQuery = query;
        let newArrayFilters = _.clone(arrayFilters);
        // console.log(resultCompare[i].arrayParent);
        if(resultCompare[i].arrayParent){ 
          console.log(arrayFilters);
          let p2 = processQuery(resultCompare[i].arrayParent,query,_.clone(arrayFilters));
          newQuery = p2.q;
          newArrayFilters = p2.a;
          // let itemParent = resultCompare[i].arrayParent;
          // let listKeyParent = Object.keys(resultCompare[i].arrayParent);
          // for(let j=0;j<listKeyParent.length;j++){
          //   console.log(j);
          //   newQuery = newQuery + '.' + listKeyParent[j] + '.$[' + listKeyParent[j] + 'Item]';
          //   let arrayFilterItem = {[listKeyParent[j] + 'Item.id']:itemParent[listKeyParent[j]]};
          //   newArrayFilters.push(arrayFilterItem);
          // }
        }
        console.log(newArrayFilters);
        itemArrQuery.query = newQuery + resultCompare[i].propertyName;
        // let arrayFilterItem = {[resultCompare[i].propertyName + 'Item.id']:conditionArray[listkey[i]]};
        // newArrayFilters.push(arrayFilterItem);
        itemArrQuery.arrayFilters = newArrayFilters;
        itemArrQuery.data = resultCompare[i].value;
        // query = query + '.' + resultCompare[i].propertyName;
        // let arrayFilterItem = {[resultCompare[i].propertyName + 'Item.id']:conditionArray[listkey[i]]};
        // arrayFilters.push(arrayFilterItem);
        arrQuery.push(itemArrQuery);
        // newArrayFilters = arrayFilters;
      }
      // console.log(arrQuery);
      let dataUpdate = {
        conditionText: condition.query,
        // query: query,
        // arrayFilters: arrayFilters,
        id: data.id,
        arrQuery: arrQuery
      }
      console.log(dataUpdate);
      axios.put('http://localhost:3009/api/demo',{dataUpdate})
        .then(res => {
          console.log(res);
          // const persons = res.data;
          // this.setState({ persons });
        })
      console.log(dataUpdate);
      console.log(condition,data);
    }

    //so sanh 2 object
    const compareObject = (obj1,obj2,res = [], parentArr = [], propertyName = '') => {
      let listKey = Object.keys(obj1);
      // console.log(parentArr);
      // console.log('start::: ',propertyName);
      for(let i=0;i<listKey.length;i++){
        // console.log(listKey[i]);
        // console.log(_.isEqual(obj1[listKey[i]],obj2[listKey[i]]));
        if(compareProperty(obj1[listKey[i]],obj2[listKey[i]])){
          continue
        } else {
          // console.log(listKey[i]);
          // console.log(JSON.stringify(obj1[listKey[i]]) === JSON.stringify(obj2[listKey[i]]) );
          // console.log(obj2[listKey[i]]);
          let oldName = '';
          if(propertyName){
            oldName = propertyName;
            parentArr[propertyName] = obj1.id;
          }
          propertyName = listKey[i];
          // console.log(i,propertyName);
          if(Array.isArray(obj1[listKey[i]])){
            // console.log(i,listKey[i]);
            let arr1 = obj1[listKey[i]];
            let arr2 = obj2[listKey[i]];
            // console.log(arr1);
            for(let j=0;j<arr1.length;j++){
              if(JSON.stringify(arr1[j]) === JSON.stringify(arr2[j])){
                continue
              } else {
                parentArr[propertyName] = arr1[j].id;
                // console.log(propertyName,parentArr);
                compareObject(arr1[j],arr2[j],res,parentArr,listKey[i]);
              }
              if(oldName){
                propertyName = oldName;
              } else {
                propertyName = '';
              }
            }
          } else {
            // console.log(propertyName,parentArr);
            let item = {};
            item.propertyName = listKey[i];
            item.value = obj2[listKey[i]];
            if(Object.keys(parentArr).length>0){
              // console.log(11111,parentArr);
              item.arrayParent = parentArr;
            }
            res.push(item);
          }
          // console.log(oldName);
        }
        parentArr = {};
      }
      return res
    }

    const compareProperty = (p1,p2) => {
      if(Array.isArray(p1) || (typeof p1 === 'object' && p1 !== null)){
        return JSON.stringify(p1) === JSON.stringify(p2)
      } 
      return p1 === p2
    }

    //function return query va arrayfilter
    const processQuery = (obj,query = '',arrayFilters = []) => {
      const listkey = Object.keys(obj);
      for(let i=0;i<listkey.length;i++){
        // console.log(listkey[i]);
        // if(i!==listkey.length-1){
          query = query + listkey[i] + '.$[' + listkey[i] + 'Item].';
        // } else {
        //   query = query + listkey[i] + '.$[' + listkey[i] + 'Item]';
        // }
        let arrayFilterItem = {[listkey[i] + 'Item.id']:obj[listkey[i]]};
        arrayFilters.push(arrayFilterItem);
      }
      return {q: query, a: arrayFilters}
    }

    //so sanh 2 array object
    // const compareArrayObject = (arr1,arr2,res = [], keyParent = '') => {
    //   console.log(keyParent);
    //   for(let i=0;i<arr1.length;i++){
    //     if(JSON.stringify(arr1[i]) === JSON.stringify(arr2[i])){
    //       continue
    //     } else {
    //       // let keyParent = 
    //       return compareObject(arr1[i],arr2[i],res,keyParent);
    //     }
    //   }
    //   console.log(111,res);
    //   return res
    // }

    useEffect(() => {
        console.log('get Data');
        axios.get('http://localhost:3009/demo')
        .then(res => {
        //   console.log(res.data);
        //   console.log(dataTest);
          if(res.data){
            setDataObj(res.data);
            setDataRes(res.data.data);
          }
          // const persons = res.data;
          // this.setState({ persons });
        })
    },[])

    const transformErrors2 = (errors, data) => {
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

    function ArrayFieldTemplate(props) {
        // if(props.schema.level===1){
        // console.log(dataObj);
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
              // console.log(data[listKey[i]]);
              // console.log(data[listKey[i]].title + " : " + formData[listKey[i]]);
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
                  <button type="button" 
                //   onClick={() => console.log(element)}
                  onClick={() => {
                      console.log(element.children.props);
                      // if(element.children.props.formData.id){
                      //   console.log(element.children.props.formData.id);
                      //   // let x = findById(element.children.props.formData.id,dataObj);
                      //   let condition = findById(element.children.props.formData.id,dataObj)
                      //   console.log(condition);
                      //   updateData(condition,element.children.props.formData);
                      //   // console.log(findById(element.children.props.formData.id,dataObj));
                      // }
                    }}
                  >
                    Chỉnh sửa
                  </button>
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
  
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
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
              formData={dataRes}
              // ErrorList={ErrorListTemplate}
            >
              <div>
                <button type="submit" className="btn btn-success">
                  Gửi
                </button>
                <button type="button" onClick={() => {
                    findById('5f068b2651ea7f73d43964d5',dataObj)
                    }}>test</button>
                {/* <button type="button">Cancel</button> */}
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }

  export default Edit;
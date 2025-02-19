import React from 'react';
import { Link } from 'react-router-dom';
import { size, map } from "lodash";

const Img = (cell) => {
    return (
        <React.Fragment>
          {!cell.value ? (
            <div className="avatar-sm d-inline-block align-middle me-2">
              <div className="avatar-title bg-light-subtle text-light font-size-24 m-0 rounded-circle">
                <i className="bx bxs-user-circle"></i>
              </div>
            </div>
          ) : (
            <div>
              <img className="rounded-circle avatar-sm" src={cell.value} alt="" />
            </div>
          )}
        </React.Fragment>
    )
};

const Name = (cell) => {
    return (
        <React.Fragment>
          <h5 className="font-size-14 mb-1">
            <Link to="#" className="text-dark">
              {cell.value}
            </Link>
          </h5>
          <p className="text-muted mb-0">{cell.designation}</p>
        </React.Fragment>
    )
};

const Email = (cell) => {
    return cell.value ? cell.value : '';
};

const Tags = (cell) => {
    return (
        <React.Fragment>
          {map(
            cell.value,
            (tag, index) =>
              index < 2 && (
                <Link
                  to="#"
                  className="badge bg-primary-subtle text-primary font-size-11 m-1"
                  key={"_skill_" + cell.id + index}
                >
                  {tag}
                </Link>
              )
          )}
          {size(cell.value) > 2 && (
            <Link
              to="#"
              className="badge bg-primary-subtle text-primary font-size-11 m-1"
              key={"_skill_" + cell.id}
            >
              {size(cell.value) - 1} + more
            </Link>
          )}
        </React.Fragment>
    );
};

const Projects = (cell) => {
    return cell.value ? cell.value : '';
};

export {
    Img,
    Name,
    Email,
    Tags,
    Projects
};
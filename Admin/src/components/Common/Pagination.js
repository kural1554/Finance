import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row } from 'reactstrap';
import NoSearchResult from "./NoSearchResult"

const Pagination = ({ perPageData, data, currentPage, setCurrentPage, currentData, className }) => {

  const pagination = true;

  const handleClick = (e) => {
    setCurrentPage(Number(e.target.id));
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
    pageNumbers.push(i);
  }
  const handleprevPage = () => {
    let prevPage = currentPage - 1;
    setCurrentPage(prevPage);
  };
  const handlenextPage = (event) => {
    event.preventDefault();
    let nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    if (pageNumbers.length && pageNumbers.length < currentPage) {
      setCurrentPage(pageNumbers.length)
    }
  }, [pageNumbers.length, currentPage, setCurrentPage])

  return (
    <React.Fragment>
      {!currentData?.length && <NoSearchResult />}
      {pagination &&
        <Row className={className} style={{ display: "flex" }}>
          <div className="col-sm">
            <div className="text-center text-sm-start">
              Showing <span className="fw-normal ms-1">{perPageData}</span> of <span className="fw-normal">{data?.length}</span> Results
            </div>
          </div>
          <div className="col-sm-auto">
            <div className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
              {currentPage <= 1 ? (
                <Link className="page-link disabled" to="#!">
                  Previous
                </Link>
              ) : (
                <Link className={`${currentPage <= 1 ? "page-link disabled" : "page-link "} `} to="#!" onClick={() => handleprevPage()}>
                  Previous
                </Link>
              )}
              {/* <ul className="pagination listjs-pagination mb-0"> */}
                {(pageNumbers || []).map((item, index) => (
                  <li className="page-item" key={index}>
                    <Link className={currentPage === item ? "page-link active " : "page-link"} to="#!" id={item} onClick={(e) => handleClick(e)}>
                      {item}
                    </Link>
                  </li>
                ))}
              {/* </ul> */}

              {currentPage >= pageNumbers.length ? (
                <Link className="page-link disabled" to="#!">
                  Next
                </Link>
              ) : (
                <Link className={`${currentPage <= 1 ? "page-link disabled" : "page-link"} `} to="#!" onClick={(e) => handlenextPage(e)}>
                  Next
                </Link>
              )}
            </div>
          </div>
        </Row>}
    </React.Fragment>
  )
}

export default Pagination
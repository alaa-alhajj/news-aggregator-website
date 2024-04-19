import { PaginationControl } from 'react-bootstrap-pagination-control';

function CustomPagination(props) {
  const { currentPage, totalPages, onPageChange } = props;

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="d-flex justify-content-center">

      <PaginationControl
        page={currentPage}
        between={5}
        total={totalPages}
        limit={1}
        changePage={(currentPage) => {
          handlePageClick(currentPage)
        }}
        ellipsis={2}
      />
    </div>
  );
}

export default CustomPagination;
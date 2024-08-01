import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ totalItems, currentPage, rowsPerPage, handlePageChange }) => {
    const pageCount = Math.ceil(totalItems / rowsPerPage);
    return (
        <Pagination>
            {Array.from({ length: pageCount }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                </Pagination.Item>
            ))}
        </Pagination>
    );
};

export default PaginationComponent;

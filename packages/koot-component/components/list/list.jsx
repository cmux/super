import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd'; 

class List extends Component {

    static propTypes = {
        children: PropTypes.node,
        config: PropTypes.object.isRequired,
    }

    render() {
        const { config } = this.props;
        const { columns, dataSource } = config;
        const props = this.propsHandler(config);
        return (
            <Table
                columns={columns}
                dataSource={dataSource}
                {...props}
            >
            </Table>
        );
    }

    propsHandler = ( config ) => {
        const nextConfig = Object.assign({}, config);

        delete nextConfig.type;
        delete nextConfig.name;
        delete nextConfig.columns;
        delete nextConfig.dataSource;
        delete nextConfig.page;

        return nextConfig;
    }
}

export default List;
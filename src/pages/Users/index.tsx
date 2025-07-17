import React, { useState, useCallback, useEffect } from "react";
import { Table, Input, Avatar, Typography, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetUsers } from "hooks/react-query/users";
import { UserData } from "services/users/interface";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  SorterResult,
  TableCurrentDataSource,
  FilterValue,
} from "antd/es/table/interface";

const { Search } = Input;
const { Text } = Typography;

const PAGE_SIZE = 13;

const Users: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(1);
  const [order, setOrder] = useState<"asc" | "desc" | undefined>(undefined);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const params = {
    limit: PAGE_SIZE,
    skip: (current - 1) * PAGE_SIZE,
    search: search || undefined,
    order: order ? `email:${order}` : undefined,
  };

  const { data: userResponse, isLoading, error } = useGetUsers(params);

  const columns: ColumnsType<UserData> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      width: 120,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: 120,
    },
    {
      title: "Name",
      key: "fullName",
      width: 200,
      render: (_, record: UserData) => (
        <Text>{`${record.firstName} ${record.lastName}`}</Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      width: 250,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image: string, record: UserData) => (
        <Avatar
          size={40}
          src={image}
          icon={<UserOutlined />}
          alt={`${record.firstName} ${record.lastName}`}
        >
          {`${record.firstName[0]}${record.lastName[0]}`}
        </Avatar>
      ),
    },
  ];

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, FilterValue | null>,
      sorter: SorterResult<UserData> | SorterResult<UserData>[],
      _extra: TableCurrentDataSource<UserData>
    ) => {
      if (pagination.current) setCurrent(pagination.current);

      if (!Array.isArray(sorter) && sorter.columnKey === "email") {
        if (sorter.order === "ascend") setOrder("asc");
        else if (sorter.order === "descend") setOrder("desc");
        else setOrder(undefined);
      } else {
        setOrder(undefined);
      }
    },
    []
  );

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert
          message="Error"
          description="Failed to load users data. Please try again."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
      >
        <Text strong>Search by Name:</Text>
        <Search
          placeholder="Enter first or last name"
          allowClear
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrent(1);
          }}
          style={{ width: 250, marginLeft: 8 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={userResponse?.users || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current,
          total: userResponse?.total || 0,
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Users;

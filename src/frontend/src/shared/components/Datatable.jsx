"use client";
import * as React from "react";

import {
    Grid,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableFooter,
    TableSortLabel,
    Toolbar,
    Typography,
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    Select,
    Menu,
    MenuItem,
    Skeleton,
    CircularProgress,
    ButtonGroup,
    Button,
    TextField
} from "@mui/material";

import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { api } from "../utils";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function Icon(attr) {
    const btnStyle = {
        fontSize: "18px",
        height: "20px",
        width: "20px",
        padding: "0",
        filter: "drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.2))",
    };
    let aria = Object.keys(attr)
        .filter((key) => key.indexOf("aria") > -1 || key.indexOf("data") > -1)
        .reduce((a, c) => {
            a[c] = attr[c];
            return a;
        }, {});
    const iconBtn = (
        <IconButton
            { ...aria }
            disabled={ attr.disabled }
            tabIndex={ attr.tabIndex ?? 0 }
            onClick={ attr.onClick }
            aria-label={ attr.label || "icon-button" }
            sx={ {
                color: "black",
                mx: "10px",
                p: 0,
                ...(attr.disabled
                    ? {
                        "&.Mui-disabled": {
                            cursor: "not-allowed",
                            pointerEvents: "auto",
                        },
                    }
                    : { cursor: "pointer" }),
                ...attr.sx,
            } }
        >
            <i
                className={ attr.iconClass }
                style={ { ...(attr.style || btnStyle) } }
                aria-hidden="true"
            />
            { attr.showLabel && (
                <span
                    style={ {
                        fontSize: "13px",
                        marginLeft: "6px",
                        opacity: "0.6",
                    } }
                >
                    { attr.label }
                </span>
            ) }
        </IconButton>
    );
    return attr?.disableTooltip ? (
        iconBtn
    ) : (
        <Tooltip title={ attr.label } placement="top" arrow>
            <span>{ iconBtn }</span>
        </Tooltip>
    );
}

function ColHeader(attr) {
    const col = attr.col;
    const feature = col?.feature?.reduce((a, c) => {
        a[c] = true;
        return a;
    }, {});
    const [isHovered, setIsHovered] = React.useState(false);
    const alignToJustifyContent = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        left: "flex-start",
        right: "flex-end",
    };
    const isEndOrRight = ["end", "right"].includes(col.align ?? "start");

    // Drag and drop handlers
    const handleDragStart = (e) => {
        if (!attr.draggable) return;
        e.dataTransfer.setData("text/plain", col.id);
        e.dataTransfer.effectAllowed = "move";
        // Set a custom drag image (optional)
        const dragIcon = document.createElement("div");
        dragIcon.textContent = col.label;
        dragIcon.style.position = "absolute";
        dragIcon.style.top = "-1000px";
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
        setTimeout(() => document.body.removeChild(dragIcon), 0);
        if (attr.onDragStart) attr.onDragStart(col.id);
    };

    const handleDragOver = (e) => {
        if (!attr.draggable) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e) => {
        if (!attr.draggable) return;
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text/plain");
        if (draggedId && draggedId !== col.id && attr.onDrop) {
            attr.onDrop(draggedId, col.id);
        }
    };

    const handleDragEnd = (e) => {
        if (!attr.draggable) return;
        if (attr.onDragEnd) attr.onDragEnd();
    };

    return (
        attr.visible && (
            <TableCell
                align={ col.align ?? "start" }
                padding="none"
                sortDirection={ attr.sorted }
                draggable={ attr.draggable }
                onDragStart={ handleDragStart }
                onDragOver={ handleDragOver }
                onDrop={ handleDrop }
                onDragEnd={ handleDragEnd }
                sx={ {
                    paddingLeft: "8px",
                    paddingRight: "4px",
                    top: 0,
                    bgcolor: "secondary.main",
                    color: "white",
                    zIndex: attr.locked ? 4 : 2,
                    fontWeight: "700",
                    fontSize: "13px",
                    minWidth: col.width ?? 200,
                    width: col.width || 200,
                    height: "36px",
                    textAlign: col.align ?? "start",
                    cursor: attr.draggable ? "grab" : "default",
                    ...(attr.locked && {
                        position: "sticky",
                        left: `${attr.lockOffset}px`,
                        boxShadow: "2px 0 5px -2px rgba(0, 0, 0, 0.3)",
                    }),
                    "&:active": {
                        cursor: attr.draggable ? "grabbing" : "default",
                    },
                } }
            >
                <Box
                    sx={ {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: alignToJustifyContent[col.align ?? "start"],
                        pointerEvents: attr.draggable ? "none" : "auto", // prevent drag from interfering with child clicks
                    } }
                >
                    { feature?.sortable && isEndOrRight && (
                        <TableSortLabel
                            active={ !!attr.sorted || isHovered }
                            direction={ attr.sorted ? attr.sorted : "asc" }
                            onClick={ (event) => {
                                event.stopPropagation();
                                attr.onSort(event, col.id);
                            } }
                            sx={ {
                                mr: 0.2,
                                color: "white",
                                visibility: attr.sorted || isHovered ? "visible" : "hidden",
                                "& .MuiTableSortLabel-icon": {
                                    color: "white !important",
                                },
                                pointerEvents: "auto",
                            } }
                        />
                    ) }
                    { feature?.sortable ? (
                        <Box
                            component="span"
                            onClick={ (event) => {
                                event.stopPropagation();
                                attr.onSort(event, col.id);
                            } }
                            onMouseEnter={ () => setIsHovered(true) }
                            onMouseLeave={ () => setIsHovered(false) }
                            sx={ {
                                cursor: "pointer",
                                pointerEvents: "auto",
                            } }
                        >
                            <Tooltip title="click to sort" placement="top">
                                { col.label }
                            </Tooltip>
                        </Box>
                    ) : (
                        <span style={ { pointerEvents: "auto" } }>{ col.label }</span>
                    ) }
                    { feature?.lockable && (
                        <Tooltip title="Toggle Column Lock" placement="top">
                            <IconButton
                                size="small"
                                onClick={ (e) => {
                                    e.stopPropagation();
                                    attr.onLock(col.id);
                                } }
                                sx={ {
                                    color: "white",
                                    pl: 0.5,
                                    m: 0,
                                    fontSize: "12px",
                                    opacity: 0.5,
                                    pointerEvents: "auto",
                                } }
                            >
                                <i
                                    className={ `fa fa-${attr.locked ? "lock" : "lock-open"}` }
                                    style={ { fontSize: "12px", marginLeft: "3px" } }
                                />
                            </IconButton>
                        </Tooltip>
                    ) }
                    { feature?.sortable && !isEndOrRight && (
                        <TableSortLabel
                            active={ !!attr.sorted || isHovered }
                            direction={ attr.sorted ? attr.sorted : "asc" }
                            onClick={ (event) => {
                                event.stopPropagation();
                                attr.onSort(event, col.id);
                            } }
                            sx={ {
                                ml: 0.2,
                                color: "white",
                                visibility: attr.sorted || isHovered ? "visible" : "hidden",
                                "& .MuiTableSortLabel-icon": {
                                    color: "white !important",
                                },
                                pointerEvents: "auto",
                            } }
                        />
                    ) }
                </Box>
            </TableCell>
        )
    );
}
async function loadData(promise, callback) {
    try {
        let resp = await promise;
        callback(resp);
    } catch (error) {
        throw new Error(error.message);
    }
}

export default function Datatable({
    parentData = null,
    hideToolbar = false,
    hideDownload = false,
    hideColumnSelector = false,
    draggableColumns = false,
    hideTitle = false,
    columns,
    disabled,
    tableName,
    ...attr
}) {
    const [hidePagination, setHidePagination] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setRowsPerPage] = React.useState(attr.pageSize ?? 10);
    const [showSelectColumns, setShowSelectColumns] = React.useState(null);
    const [searchTerms, setSearchTerms] = React.useState({});
    const [lockedColumns, setLockedColumns] = React.useState({});
    const [lockedRows, setLockedRows] = React.useState({});

    // Column order state for drag & drop
    const [columnOrder, setColumnOrder] = React.useState(() =>
        columns.map((col) => col.id),
    );

    // Sync column order when columns prop changes (new columns added/removed)
    React.useEffect(() => {
        setColumnOrder((prevOrder) => {
            const newIds = columns.map((col) => col.id);
            const merged = [...prevOrder.filter((id) => newIds.includes(id))];
            newIds.forEach((id) => {
                if (!merged.includes(id)) merged.push(id);
            });
            return merged;
        });
    }, [columns]);

    // Reorder function
    const reorderColumns = (draggedId, targetId) => {
        setColumnOrder((prevOrder) => {
            const draggedIndex = prevOrder.indexOf(draggedId);
            const targetIndex = prevOrder.indexOf(targetId);
            if (draggedIndex === -1 || targetIndex === -1) return prevOrder;

            const newOrder = [...prevOrder];
            newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, draggedId);
            return newOrder;
        });
    };

    // Get ordered columns based on current columnOrder
    const orderedColumns = React.useMemo(() => {
        return columnOrder
            .map((id) => columns.find((col) => col.id === id))
            .filter(Boolean);
    }, [columnOrder, columns]);

    const [filterValues, setFilterValues] = React.useState({});
    const [categoryFilterAnchor, setCategoryFilterAnchor] = React.useState(null);
    const [categoryFilter, setCategoryFilter] = React.useState([]);
    const tableRef = React.useRef();
    const [statusFilterAnchor, setStatusFilterAnchor] = React.useState(null);
    const [statusFilter, setStatusFilter] = React.useState([]);

    const disabledColumns = attr.disabledColumns || [];
    const [defaultHiddenColumns, hideColumns] = React.useState(
        attr.defaultHiddenColumns || [],
    );
    const [columnVisibility, setColumnVisibility] = React.useState(() =>
        columns.reduce(
            (acc, cell) => ({
                ...acc,
                [cell.id]: !cell.hidden && !defaultHiddenColumns.includes(cell.id),
            }),
            {},
        ),
    );
    React.useEffect(() => {
        if (!tableName) return () => { };
        loadData(
            api.post("/api/v1/me/table-config", { table: tableName }),
            (resp) => {
                if (resp.status !== "success") return;
                if ("data" in resp && "fields" in resp.data) {
                    hideColumns(resp?.data?.fields);
                }
            },
        );
    }, [tableName]);
    React.useEffect(() => {
        if (!tableName) return () => { };
        const timeout = setTimeout(async () => {
            await api.patch("/api/v1/me/table-config", {
                table: tableName,
                fields: Object.keys(columnVisibility).filter(
                    (key) => !columnVisibility[key],
                ),
            });
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [columnVisibility, tableName]);

    React.useEffect(() => {
        setHidePagination(attr.hidePagination);
    }, [attr.hidePagination]);
    const hasSearchableColumn = React.useMemo(() => {
        return columns.some((col) => col?.feature?.includes("searchable"));
    }, [columns]);

    React.useEffect(() => {
        setColumnVisibility(
            columns.reduce(
                (acc, cell) => ({
                    ...acc,
                    [cell.id]: !cell.hidden && !defaultHiddenColumns.includes(cell.id),
                }),
                {},
            ),
        );
    }, [columns]);

    const handleColumnToggle = (columnId) => {
        if (disabledColumns.includes(columnId)) return;
        setColumnVisibility((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
    };

    React.useEffect(() => {
        if (!attr.onSelect) return;
        attr.onSelect(selected);
    }, [selected]);
    const data = attr.data;

    const loading =
        "isLoading" in attr ? attr.isLoading : !data || data.length === 0;

    const effectiveStatusOptions = React.useMemo(() => {
        if (!data || data.length === 0 || !attr.statusOptions?.length) {
            return [];
        }
        const uniqueStatuses = [
            ...new Set(data.map((row) => String(row.status))),
        ].filter((value) => value && value !== "null" && value !== "undefined");
        return attr.statusOptions
            .filter((option) => uniqueStatuses.includes(option.value))
            .map(({ value, label }) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [data, attr.statusOptions]);

    const getFilterOptions = (columnId) => {
        if (!data) return [];
        const uniqueValues = [
            ...new Set(data.map((row) => String(row[columnId]))),
        ].sort();
        return uniqueValues.filter(
            (value) => value !== undefined && value !== null && value !== "",
        );
    };

    const handleOpenStatusFilter = (event) =>
        setStatusFilterAnchor(event.currentTarget);

    const handleCloseStatusFilter = () => setStatusFilterAnchor(null);

    const handleStatusFilterToggle = (value) => {
        setStatusFilter((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
        );
        setPage(0);
    };

    const onLockColumn = (columnId) => {
        setLockedColumns((prev) => ({
            ...prev,
            [columnId]: !prev[columnId],
        }));
    };

    const toggleRowLock = (rowId) => {
        setLockedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    const onSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = filteredRows.map((n) => n.id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const onCheckRow = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) newSelected = [...selected, id];
        else if (selectedIndex === 0) newSelected = selected.slice(1);
        else if (selectedIndex === selected.length - 1)
            newSelected = selected.slice(0, -1);
        else
            newSelected = [
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ];

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenColumnMenu = (event) =>
        setShowSelectColumns(event.currentTarget);

    const handleCloseColumnMenu = () => setShowSelectColumns(null);

    const handleOpenCategoryFilter = (event) =>
        setCategoryFilterAnchor(event.currentTarget);

    const handleCloseCategoryFilter = () => setCategoryFilterAnchor(null);

    const handleCategoryFilterToggle = (value) => {
        setCategoryFilter((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
        );
        setPage(0);
    };

    const onSearch = (event, columnId) => {
        setSearchTerms((prev) => ({ ...prev, [columnId]: event.target.value }));
        setPage(0);
    };

    const onFilterChange = (event, columnId) => {
        setFilterValues((prev) => ({ ...prev, [columnId]: event.target.value }));
        setPage(0);
    };

    const getRowValue = React.useCallback(
        (row, columnId) => {
            const col = columns.find((c) => c.id === columnId);
            if (!col) return "";
            if (col.data) {
                return row[col.data] ?? "";
            }
            if (col.render) {
                const rendered = col.render(row, parentData);
                return jsxToText(rendered);
            }
            return row[columnId] ?? "";
        },
        [columns, parentData],
    );

    const filteredRows = React.useMemo(() => {
        const rows = Array.isArray(data) ? data : [];
        return rows.filter((row) => {
            if (!row) return false;
            const matchesSearch = Object.entries(searchTerms).every(
                ([column, term]) =>
                    !term ||
                    String(row[column]).toLowerCase().includes(term.toLowerCase()) ||
                    String(getRowValue(row, column))
                        .toLowerCase()
                        .includes(term.toLowerCase()),
            );

            const matchesFilters = Object.entries(filterValues).every(
                ([column, value]) => !value || String(row[column]) === value,
            );

            const matchesCategory =
                categoryFilter.length === 0 ||
                (categoryFilter.includes("client") &&
                    categoryFilter.includes("vendor") &&
                    row.category?.isClient &&
                    row.category?.isVendor) ||
                (categoryFilter.includes("client") &&
                    !categoryFilter.includes("vendor") &&
                    row.category?.isClient) ||
                (categoryFilter.includes("vendor") &&
                    !categoryFilter.includes("client") &&
                    row.category?.isVendor);

            const matchesBidStatus =
                statusFilter.length === 0 || statusFilter.includes(row.status);
            return (
                matchesSearch && matchesFilters && matchesCategory && matchesBidStatus
            );
        });
    }, [data, searchTerms, filterValues, categoryFilter, statusFilter]);

    const visibleRows = React.useMemo(() => {
        const sorted = [...filteredRows].sort(getComparator(order, orderBy));
        return hidePagination
            ? sorted
            : sorted.slice(page * pageSize, page * pageSize + pageSize);
    }, [order, orderBy, page, pageSize, filteredRows, hidePagination]);

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const headerRowHeight = 36;
    let stickyOffset = headerRowHeight + 40;

    // Updated offset calculation using orderedColumns
    const getLockedColumnOffset = (columnId) => {
        let offset = 0;
        for (const col of orderedColumns) {
            if (!columnVisibility[col.id] || !lockedColumns[col.id]) continue;
            if (col.id === columnId) break;
            offset += parseInt(col.width, 10) || 180;
        }
        return offset;
    };

    const calculateColumnTotals = (rows, cols, colVisibility, parentData) => {
        const totals = {};
        cols.forEach((col) => {
            if (col?.feature?.includes("total") && colVisibility[col.id]) {
                const sum = rows.reduce((acc, row) => {
                    let value;
                    if (col.data) {
                        value = parseFloat(row[col.data]);
                    } else if (col.render) {
                        let temp = jsxToText(col.render(row, parentData)).replace(
                            /[^\d.-]+/g,
                            "",
                        );
                        value = parseFloat(temp);
                    }
                    const numericValue = isNaN(value) ? 0 : value;
                    return acc + numericValue;
                }, 0);
                totals[col.id] = sum;
            }
        });
        return totals;
    };

    const columnTotals = React.useMemo(
        () =>
            calculateColumnTotals(
                visibleRows,
                orderedColumns,
                columnVisibility,
                parentData,
            ),
        [visibleRows, orderedColumns, columnVisibility, parentData],
    );

    const columnTotalsOverall = React.useMemo(
        () =>
            calculateColumnTotals(
                filteredRows,
                orderedColumns,
                columnVisibility,
                parentData,
            ),
        [filteredRows, orderedColumns, columnVisibility, parentData],
    );

    React.useEffect(() => {
        setSelected([]);
    }, [data]);

    const firstVisibleColumn = orderedColumns.find(
        (col) => columnVisibility[col.id],
    )?.id;

    return (
        <Box sx={ { minWidth: "100%" } }>
            <Box
                sx={ {
                    p: 0.5,
                } }
            >
                { !hideToolbar && (
                    <Box sx={ { width: "100%" } }>
                        <Toolbar
                            sx={ {
                                minHeight: "52px !important",
                                py: 1,
                                px: "0 !important",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: hideTitle ? "flex-end" : "default",
                            } }
                        >
                            { attr.back && (
                                <Icon
                                    iconClass="fa fa-arrow-left"
                                    onClick={ attr.back }
                                    label="Back"
                                />
                            ) }
                            { !hideTitle && (
                                <Typography
                                    sx={ { flex: "1 1 100%", fontWeight: "bold" } }
                                    variant="h5"
                                    component="div"
                                >
                                    { attr.title }
                                </Typography>
                            ) }
                            { attr.extra }
                            { attr.upload && (
                                <Icon
                                    iconClass="fas fa-upload"
                                    onClick={ attr.upload }
                                    label="Upload"
                                />
                            ) }
                            { attr.categoryFilter && (
                                <Icon
                                    iconClass="fas fa-tag"
                                    onClick={ handleOpenCategoryFilter }
                                    label="Filter by category"
                                />
                            ) }
                            { attr.statusFilter && (
                                <Icon
                                    iconClass="fas fa-tag"
                                    onClick={ handleOpenStatusFilter }
                                    label="Filter by status"
                                />
                            ) }
                            { attr.add && (
                                <Icon iconClass="fas fa-plus" onClick={ attr.add } label="Add" />
                            ) }
                            { !hideDownload && (
                                <Icon
                                    iconClass="fas fa-download"
                                    label="Download Table Data"
                                    onClick={ (e) => {
                                        const visibleColumns = orderedColumns.filter(
                                            (col) => columnVisibility[col.id],
                                        );

                                        const headers = visibleColumns.map((col) => col.label);

                                        const dataRows = filteredRows.map((row) => {
                                            return visibleColumns.map((col) => {
                                                if (col.data) {
                                                    return row?.[col.data] ?? "";
                                                } else if (col.render) {
                                                    const rendered = col.render(row, parentData);
                                                    return rendered;
                                                }
                                                return "";
                                            });
                                        });

                                        const hasAnyTotal = visibleColumns.some((col) =>
                                            col?.feature?.includes("total"),
                                        );

                                        const totalsRow = visibleColumns.map((col, index) => {
                                            if (index === 0 && hasAnyTotal) {
                                                return "Total";
                                            }
                                            if (col?.feature?.includes("total")) {
                                                return columnTotalsOverall[col.id] != null
                                                    ? columnTotalsOverall[col.id]
                                                    : "";
                                            }
                                            return "";
                                        });

                                        const exportData = [headers, ...dataRows, totalsRow];

                                        DownloadTable({
                                            info: exportData,
                                            title: attr.title,
                                            replaceChars: attr.replaceChars,
                                        });
                                    } }
                                />
                            ) }
                            { hasSearchableColumn && (
                                <Icon
                                    iconClass="fas fa-search"
                                    onClick={ (e) => {
                                        setShowSearch(!showSearch);
                                    } }
                                    label={ showSearch ? "Hide Search" : "Show Search" }
                                />
                            ) }
                            { !hideColumnSelector && (
                                <Icon
                                    iconClass="fas fa-filter"
                                    onClick={ handleOpenColumnMenu }
                                    label="Show / Hide Columns"
                                />
                            ) }
                        </Toolbar>
                        <Menu
                            anchorEl={ showSelectColumns }
                            open={ Boolean(showSelectColumns) }
                            onClose={ handleCloseColumnMenu }
                        >
                            <Grid size={ 12 } container justifyContent="flex-end" px={ 1 } py={ 0.5 }>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={ Object.values(columnVisibility).reduce((a, c) => a && c, true) }
                                    onClick={ async () => {
                                        // await api.delete("/api/v1/me/table-config", {
                                        //   table: tableName,
                                        // });
                                        setColumnVisibility(
                                            Object.fromEntries(
                                                Object.entries(columnVisibility).map(data => [data[0], true])
                                            )
                                        )
                                    } }
                                >
                                    Reset
                                </Button>
                            </Grid>
                            { columns.map((cell) => (
                                <MenuItem
                                    key={ cell.id }
                                    onClick={ () => handleColumnToggle(cell.id) }
                                    disabled={ disabledColumns.includes(cell.id) }
                                    sx={ {
                                        fontSize: 14,
                                        px: 2,
                                        py: 0.5,
                                    } }
                                >
                                    <Checkbox checked={ columnVisibility[cell.id] } size="small" />
                                    { cell.label }
                                </MenuItem>
                            )) }
                        </Menu>
                        <Menu
                            anchorEl={ statusFilterAnchor }
                            open={ Boolean(statusFilterAnchor) }
                            onClose={ handleCloseStatusFilter }
                        >
                            { effectiveStatusOptions.map((option) => (
                                <MenuItem
                                    key={ option.value }
                                    onClick={ () => handleStatusFilterToggle(option.value) }
                                    sx={ { fontSize: 14, pr: 3, py: 0.5 } }
                                >
                                    <Checkbox
                                        checked={
                                            statusFilter.length === 0 ||
                                            statusFilter.includes(option.value)
                                        }
                                        size="small"
                                    />
                                    { option.label }
                                </MenuItem>
                            )) }
                        </Menu>
                        <Menu
                            anchorEl={ categoryFilterAnchor }
                            open={ Boolean(categoryFilterAnchor) }
                            onClose={ handleCloseCategoryFilter }
                        >
                            <MenuItem
                                onClick={ () => handleCategoryFilterToggle("client") }
                                sx={ { fontSize: 14, px: 2, py: 0.5 } }
                            >
                                <Checkbox
                                    checked={ categoryFilter.includes("client") }
                                    size="small"
                                />
                                Client
                            </MenuItem>
                            <MenuItem
                                onClick={ () => handleCategoryFilterToggle("vendor") }
                                sx={ { fontSize: 14, px: 2, py: 0.5 } }
                            >
                                <Checkbox
                                    checked={ categoryFilter.includes("vendor") }
                                    size="small"
                                />
                                Vendor
                            </MenuItem>
                        </Menu>
                    </Box>
                ) }
                <Box sx={ { position: "relative" } }>
                    <TableContainer
                        component={ Paper }
                        sx={ {
                            boxShadow: 2,
                            borderRadius: attr.noBorderRadius ? "0" : "10px",
                            maxHeight:
                                attr.maxHeight ||
                                (attr?.withSelected
                                    ? "calc(100vh - 293px)"
                                    : "calc(100vh - 250px)"),
                            overflow: "auto",
                            position: "relative",
                            minWidth: "100%",
                        } }
                    >
                        { loading && (
                            <>
                                <Box
                                    sx={ {
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                                        zIndex: 9,
                                    } }
                                />
                                <Box
                                    sx={ {
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        display: "inline-flex",
                                        zIndex: 10,
                                    } }
                                >
                                    <CircularProgress disableShrink size={ 120 } thickness={ 0.8 } />
                                    <Box
                                        sx={ {
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "column",
                                        } }
                                    >
                                        <Box
                                            component="img"
                                            src="/images/logos/sampledge-logo-color.webp"
                                            alt="loading logo"
                                            sx={ {
                                                height: "45px",
                                                width: "45px",
                                                opacity: 0.9,
                                            } }
                                        />
                                        <Typography
                                            sx={ {
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                color: "secondary.main",
                                            } }
                                        >
                                            SAMPLEDGE
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        ) }
                        <Table
                            ref={ tableRef }
                            stickyHeader
                            size="small"
                            sx={ {
                                minWidth: "100%",
                                overflowX: "scroll",
                                tableLayout: "fixed",
                                "& tbody td": {
                                    height: "32px",
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                },
                                "& tbody tr": {
                                    height: "32px",
                                },
                                "& thead th": {
                                    border: "1px solid rgba(255, 255, 255, 0.4)",
                                },
                                "& tfoot td": {
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    fontWeight: "bold",
                                    color: "black",
                                    fontSize: "13px",
                                    height: "32px",
                                },
                                filter: disabled ? "grayscale(1)" : "",
                            } }
                        >
                            <TableHead>
                                <TableRow>
                                    { attr.rowLockable && (
                                        <TableCell
                                            sx={ {
                                                position: "sticky",
                                                top: 0,
                                                zIndex: 5,
                                                backgroundColor: "white",
                                                width: "50px !important",
                                            } }
                                        />
                                    ) }
                                    { attr.rowSelectable && (
                                        <TableCell
                                            sx={ {
                                                position: "sticky",
                                                top: 0,
                                                bgcolor: "secondary.main",
                                                width: "35.5px !important",
                                                maxWidth: "35.5px !important",
                                                p: "0 !important",
                                            } }
                                        >
                                            <Box
                                                sx={ {
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                } }
                                            >
                                                <Checkbox
                                                    color="white"
                                                    size="small"
                                                    inputProps={ { "aria-label": "select all rows" } }
                                                    sx={ {
                                                        width: "16px !important",
                                                        height: "16px !important",
                                                        padding: 0,
                                                        margin: 0,
                                                        "& .MuiSvgIcon-root": {
                                                            width: "16px !important",
                                                            height: "16px !important",
                                                            color: "white",
                                                        },
                                                    } }
                                                    indeterminate={
                                                        selected.length > 0 &&
                                                        selected.length < filteredRows.length
                                                    }
                                                    checked={
                                                        filteredRows.length > 0 &&
                                                        selected.length === filteredRows.length
                                                    }
                                                    onChange={ handleSelectAllClick }
                                                />
                                            </Box>
                                        </TableCell>
                                    ) }
                                    { orderedColumns.map((col) => (
                                        <ColHeader
                                            col={ col }
                                            key={ col.id }
                                            visible={ columnVisibility[col.id] }
                                            locked={ lockedColumns[col.id] }
                                            sorted={ orderBy === col.id ? order : false }
                                            onSort={ onSort }
                                            onLock={ onLockColumn }
                                            lockOffset={ getLockedColumnOffset(col.id) }
                                            draggable={ draggableColumns }
                                            onDrop={ reorderColumns }
                                        />
                                    )) }
                                </TableRow>
                                { showSearch && (
                                    <TableRow>
                                        { attr.rowLockable && (
                                            <TableCell
                                                sx={ {
                                                    position: "sticky",
                                                    top: headerRowHeight,
                                                    zIndex: 5,
                                                    backgroundColor: "white",
                                                    border: "1px solid rgba(0, 0, 0, 0.12) !important",
                                                    width: "20px",
                                                } }
                                            />
                                        ) }
                                        { attr.rowSelectable && (
                                            <TableCell
                                                sx={ {
                                                    position: "sticky",
                                                    top: headerRowHeight,
                                                    border: "1px solid rgba(0, 0, 0, 0.12) !important",
                                                    zIndex: 5,
                                                    backgroundColor: "white",
                                                    width: "35px !important",
                                                } }
                                            />
                                        ) }
                                        { orderedColumns.map((col) => {
                                            const searchable = col?.feature?.includes("searchable");
                                            const filterable = col?.feature?.includes("filterable");
                                            if (!columnVisibility[col.id]) return null;
                                            return (
                                                <TableCell
                                                    key={ col.id }
                                                    align={ col.align ?? "start" }
                                                    sx={ {
                                                        top: headerRowHeight,
                                                        zIndex: lockedColumns[col.id] ? 5 : 1,
                                                        backgroundColor: "white",
                                                        border: "1px solid rgba(0, 0, 0, 0.12) !important",
                                                        minWidth: col.width ?? 200,
                                                        py: 0.5,
                                                        pr: 1,
                                                        pl: 0,
                                                        ...(lockedColumns[col.id] && {
                                                            position: "sticky",
                                                            left: `${getLockedColumnOffset(col.id)}px`,
                                                            boxShadow: "2px 0 5px -2px rgba(0, 0, 0, 0.3)",
                                                        }),
                                                    } }
                                                >
                                                    { searchable && (
                                                        <TextField
                                                            sx={ {
                                                                mx: 1,
                                                                width: "calc(100% - 8px)",
                                                                height: "24px",
                                                                "& .MuiInputBase-root": {
                                                                    height: "24px",
                                                                    fontSize: "12px",
                                                                },
                                                                "& .MuiInputBase-input": {
                                                                    padding: "8px 10px",
                                                                    textAlign: col.align ?? "start",
                                                                },
                                                            } }
                                                            size="small"
                                                            type="text"
                                                            value={ searchTerms[col.id] || "" }
                                                            onChange={ (e) => onSearch(e, col.id) }
                                                            placeholder={ `Search ${col.label}` }
                                                        />
                                                    ) }
                                                    { filterable && (
                                                        <Select
                                                            value={ filterValues[col.id] || "" }
                                                            onChange={ (e) => onFilterChange(e, col.id) }
                                                            size="small"
                                                            displayEmpty
                                                            sx={ {
                                                                ml: 1,
                                                                width: "calc(100% - 8px)",
                                                                height: "24px",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                "& .MuiSelect-select": {
                                                                    padding: "4px",
                                                                    fontSize: "12px !important",
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                },
                                                            } }
                                                        >
                                                            <MenuItem
                                                                value=""
                                                                sx={ {
                                                                    pl: 1,
                                                                    fontSize: "12px",
                                                                    pl: 2,
                                                                    minHeight: "24px",
                                                                } }
                                                            >
                                                                All
                                                            </MenuItem>
                                                            { getFilterOptions(col.id).map((opt) => (
                                                                <MenuItem
                                                                    key={ opt }
                                                                    value={ opt }
                                                                    sx={ {
                                                                        pl: 2,
                                                                        fontSize: "12px",
                                                                        minHeight: "24px",
                                                                    } }
                                                                >
                                                                    { opt === "true"
                                                                        ? "Active"
                                                                        : opt === "false"
                                                                            ? "Inactive"
                                                                            : opt }
                                                                </MenuItem>
                                                            )) }
                                                        </Select>
                                                    ) }
                                                </TableCell>
                                            );
                                        }) }
                                    </TableRow>
                                ) }
                            </TableHead>
                            <TableBody>
                                { loading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                orderedColumns.filter((col) => columnVisibility[col.id])
                                                    .length +
                                                (attr.rowLockable ? 1 : 0) +
                                                (attr.rowSelectable ? 1 : 0)
                                            }
                                            sx={ {
                                                height: "320px !important",
                                                position: "relative",
                                            } }
                                        ></TableCell>
                                    </TableRow>
                                ) : visibleRows.length > 0 ? (
                                    <>
                                        { visibleRows.map((row, index) => {
                                            if (!row) return null;
                                            const isItemSelected = row?.id
                                                ? isSelected(row.id)
                                                : false;
                                            const isLocked = lockedRows[row.id];
                                            const rowTop = isLocked ? stickyOffset : "auto";

                                            if (isLocked) {
                                                stickyOffset += 33;
                                            }
                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={ -1 }
                                                    key={ row?.id || `row-${index}` }
                                                    selected={ isItemSelected }
                                                    sx={ {
                                                        position: isLocked ? "sticky" : "static",
                                                        top: isLocked ? `${rowTop}px` : "auto",
                                                        zIndex: isLocked ? 5 : 0,
                                                        "&.Mui-selected": {
                                                            backgroundColor: "#c1e3ff !important",
                                                        },
                                                        ":hover": {
                                                            backgroundColor: "#effeff !important",
                                                        },
                                                        "&.Mui-selected:hover": {
                                                            backgroundColor: "#a7d4fc !important",
                                                        },
                                                        backgroundColor: isLocked
                                                            ? "#e4f5f7"
                                                            : index & 1
                                                                ? "#f0f0f0"
                                                                : "background.default",
                                                    } }
                                                >
                                                    { attr.rowLockable && (
                                                        <TableCell sx={ { width: "20px" } }>
                                                            <Tooltip title="Toggle Row Lock">
                                                                <IconButton
                                                                    size="small"
                                                                    aria-label="toggle row lock"
                                                                    onClick={ (e) => {
                                                                        e.stopPropagation();
                                                                        toggleRowLock(row.id);
                                                                    } }
                                                                    sx={ {
                                                                        color: "grey",
                                                                        pl: 0.5,
                                                                        m: 0,
                                                                        fontSize: "12px",
                                                                        opacity: 0.5,
                                                                    } }
                                                                >
                                                                    <i
                                                                        className={ `fa fa-${lockedRows[row.id] ? "lock" : "lock-open"
                                                                            }` }
                                                                    />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    ) }
                                                    { attr.rowSelectable && (
                                                        <TableCell
                                                            sx={ {
                                                                width: "35.5px !important",
                                                                maxWidth: "35.5px !important",
                                                                p: "0 !important",
                                                            } }
                                                        >
                                                            <Box
                                                                sx={ {
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                } }
                                                            >
                                                                <Checkbox
                                                                    color="primary"
                                                                    size="small"
                                                                    inputProps={ { "aria-label": "select row" } }
                                                                    sx={ {
                                                                        width: "16px !important",
                                                                        height: "16px !important",
                                                                        padding: 0,
                                                                        margin: 0,
                                                                        "& .MuiSvgIcon-root": {
                                                                            width: "16px !important",
                                                                            height: "16px !important",
                                                                        },
                                                                    } }
                                                                    onClick={ (event) => onCheckRow(event, row.id) }
                                                                    checked={ isItemSelected }
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                    ) }
                                                    { orderedColumns.map(
                                                        (cell) =>
                                                            columnVisibility[cell.id] && (
                                                                <TableCell
                                                                    key={ cell.id }
                                                                    align={ cell.align || "start" }
                                                                    sx={ {
                                                                        whiteSpace: "nowrap",
                                                                        textAlign: cell.align || "start",
                                                                        p: "0 !important",
                                                                        m: "0 !important",
                                                                        height: "20px",
                                                                        fontSize: "13px",
                                                                        fontWeight: "500",
                                                                        minWidth: "100px",
                                                                        width: cell.width || "150px",
                                                                        px: "8px !important",
                                                                        ...(lockedColumns[cell.id] && {
                                                                            position: "sticky",
                                                                            left: `${getLockedColumnOffset(
                                                                                cell.id,
                                                                            )}px`,
                                                                            backgroundColor: "inherit",
                                                                            boxShadow:
                                                                                "2px 0 5px -2px rgba(0, 0, 0, 0.3)",
                                                                            zIndex: 2,
                                                                        }),
                                                                    } }
                                                                >
                                                                    { cell.data
                                                                        ? (row?.[cell.data] ?? "")
                                                                        : (cell.render?.(row, parentData) ?? "") }
                                                                </TableCell>
                                                            ),
                                                    ) }
                                                </TableRow>
                                            );
                                        }) }
                                        { filteredRows.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={ orderedColumns.length + 2 } />
                                            </TableRow>
                                        ) }
                                    </>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                orderedColumns.filter((col) => columnVisibility[col.id])
                                                    .length +
                                                (attr.rowLockable ? 1 : 0) +
                                                (attr.rowSelectable ? 1 : 0)
                                            }
                                            align="start"
                                        >
                                            <Box
                                                sx={ {
                                                    width: {
                                                        xs: "100vw",
                                                        md: attr.noDataWidth ?? "calc(100vw - 280px)",
                                                    },
                                                    height: "320px !important",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                } }
                                            >
                                                No data found.
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) }
                            </TableBody>
                            { Object.keys(columnTotals).length > 0 && (
                                <TableFooter>
                                    <TableRow>
                                        { attr.rowLockable && (
                                            <TableCell
                                                sx={ {
                                                    width: "20px",
                                                    position: "sticky",
                                                    bottom: 0,
                                                    zIndex: 3,
                                                    backgroundColor: "#f0f0f0",
                                                } }
                                            />
                                        ) }
                                        { attr.rowSelectable && (
                                            <TableCell
                                                sx={ {
                                                    width: "35.5px !important",
                                                    maxWidth: "35.5px !important",
                                                    p: "0 !important",
                                                    position: "sticky",
                                                    bottom: 0,
                                                    zIndex: 3,
                                                    backgroundColor: "#f0f0f0",
                                                } }
                                            />
                                        ) }
                                        { orderedColumns.map(
                                            (cell) =>
                                                columnVisibility[cell.id] && (
                                                    <TableCell
                                                        key={ cell.id }
                                                        align={ cell.align || "start" }
                                                        sx={ {
                                                            whiteSpace: "nowrap",
                                                            textAlign: cell.align || "start",
                                                            p: "0 !important",
                                                            m: "0 !important",
                                                            height: "32px",
                                                            fontSize: "13px",
                                                            fontWeight: "bold",
                                                            minWidth: "100px",
                                                            width: cell.width || "150px",
                                                            px: "8px !important",
                                                            position: "sticky",
                                                            bottom: 0,
                                                            zIndex: 3,
                                                            backgroundColor: "#f0f0f0",
                                                            ...(lockedColumns[cell.id] && {
                                                                position: "sticky",
                                                                left: `${getLockedColumnOffset(cell.id)}px`,
                                                                boxShadow: "2px 0 5px -2px rgba(0, 0, 0, 0.3)",
                                                                zIndex: 4,
                                                            }),
                                                        } }
                                                    >
                                                        { cell?.feature?.includes("total")
                                                            ? cell.total
                                                                ? cell.total(columnTotals[cell.id] || "0.00")
                                                                : columnTotals[cell.id] || "0.00"
                                                            : cell.id === orderedColumns[0]?.id
                                                                ? "Total"
                                                                : "" }
                                                    </TableCell>
                                                ),
                                        ) }
                                    </TableRow>
                                </TableFooter>
                            ) }
                        </Table>
                    </TableContainer>

                    { !hidePagination && (
                        <Box
                            sx={ {
                                bgcolor: "white",
                                position: "sticky",
                                borderBottomLeftRadius: "10px",
                                borderBottomRightRadius: "10px",
                                bottom: 0,
                                width: "100%",
                                zIndex: 3,
                                p: 0.5,
                                display: "flex",
                                justifyContent: "flex-end",
                            } }
                        >
                            <TablePagination
                                rowsPerPageOptions={ attr.pagination }
                                component="div"
                                count={ filteredRows.length }
                                rowsPerPage={ pageSize }
                                page={ page }
                                onPageChange={ handleChangePage }
                                onRowsPerPageChange={ handleChangeRowsPerPage }
                                showFirstButton={ true }
                                showLastButton={ true }
                                ActionsComponent={ (attr) => (
                                    <PaginationButtons
                                        { ...attr }
                                        onPageChange={ handleChangePage }
                                    />
                                ) }
                                labelDisplayedRows={ ({ from, to, count, page }) =>
                                    `Showing ${from} - ${to} of ${count}`
                                }
                                slotProps={ {
                                    select: {
                                        MenuProps: {
                                            PaperProps: {
                                                sx: {
                                                    "& .MuiMenuItem-root": {
                                                        fontSize: "13px",
                                                    },
                                                    zIndex: 4000,
                                                },
                                            },
                                            MenuListProps: {
                                                sx: {
                                                    zIndex: 4000,
                                                },
                                            },
                                            disablePortal: true,
                                        },
                                    },
                                } }
                                sx={ {
                                    height: "auto",
                                    p: 0,
                                    m: 0,

                                    "& .MuiTablePagination-toolbar": {
                                        minHeight: "30px",
                                        padding: 0,
                                        margin: 0,
                                        width: "100%",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                    },
                                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                                    {
                                        margin: 0,
                                        padding: 0,
                                        fontSize: "13px !important",
                                    },
                                    "& .MuiTablePagination-select": {
                                        fontSize: "13px !important",
                                    },
                                    "& .MuiInputBase-root": {
                                        fontSize: "13px !important",
                                    },
                                    "& .MuiTablePagination-actions": {
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "4px",
                                        margin: 0,
                                    },
                                } }
                            />
                        </Box>
                    ) }

                    { attr?.progress?.isVisible === true && (
                        <>
                            <Box
                                sx={ {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(2px)",
                                    zIndex: 9,
                                } }
                            />
                            <ShowProgress
                                shape="circle"
                                status={ Math.round(
                                    (attr.progress.current / selected.length) * 100,
                                ) }
                            />
                        </>
                    ) }
                </Box>
            </Box>
            { attr?.withSelected }
        </Box>
    );
}
export function ShowProgress({ shape = "circle", status: currentValue = 0 }) {
    return (
        <Box
            sx={ {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "inline-flex",
                zIndex: 10,
            } }
        >
            <CircularProgress
                variant="determinate"
                value={ currentValue }
                size={ 50 }
                thickness={ 3 }
            />
            <Box
                sx={ {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                } }
            >
                <Typography
                    sx={ {
                        fontSize: "12px",
                    } }
                >{ `${currentValue}%` }</Typography>
            </Box>
        </Box>
    );
}


function sluggify({ data }) {
    if (!data) return;
    return data
        .trim() // Remove leading/trailing whitespace
        .toLowerCase() // Convert to lowercase for consistency
        .replace(/[^a-z0-9\s]/g, "-") // Replace special characters with dash
        .replace(/\s+/g, "-") // Replace whitespace sequences with dash
        .replace(/-+/g, "-") // Collapse multiple consecutive dashes
        .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

function jsxToText(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
        // Clean string of invisible Unicode characters
        return value
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
            .replace(/ /g, " ") // Replace non-breaking space with regular space
            .trim();
    }
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value.toString();

    if (React.isValidElement(value)) {
        try {
            const extractTextFromElement = (element) => {
                if (typeof element === "string" || typeof element === "number") {
                    return element.toString();
                }

                if (React.isValidElement(element)) {
                    const { children } = element.props || {};

                    if (!children) return "";

                    if (typeof children === "string" || typeof children === "number") {
                        return children.toString();
                    }

                    if (Array.isArray(children)) {
                        return children.map(extractTextFromElement).join(" ");
                    }

                    return extractTextFromElement(children);
                }

                return "";
            };

            const textContent = extractTextFromElement(value);

            return textContent
                .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
                .replace(/ /g, " ") // Replace non-breaking space with regular space
                .replace(/\s+/g, " ") // Replace multiple whitespace with single space
                .trim();
        } catch (error) {
            console.warn("Failed to convert JSX to text:", error);
            return "";
        }
    }

    // Handle arrays (in case of multiple JSX elements)
    if (Array.isArray(value)) {
        return value.map(jsxToText).filter(Boolean).join(" ");
    }

    // Handle objects with toString method
    if (
        typeof value === "object" &&
        value.toString !== Object.prototype.toString
    ) {
        return value.toString();
    }

    return "";
}

function DownloadTable({ info, title, replaceChars }) {
    if (!info || !info.length) return;
    if (!title) title = "Sampledge-Downloads";

    const csvRows = info
        .map((row) =>
            row
                .map((val) => {
                    const textValue = jsxToText(val);
                    // Escape quotes and handle comma-containing values
                    const escapedValue = textValue.replace(/"/g, '""');
                    const finalValue =
                        textValue.includes(",") ||
                            textValue.includes('"') ||
                            textValue.includes("\n")
                            ? `"${escapedValue}"`
                            : escapedValue;
                    return finalValue.replace(replaceChars ?? /[\r\n]+/g, " ");
                })
                .join(",")
        )
        .join("\n");

    // Create blob without BOM - let the browser handle encoding
    const blob = new Blob([csvRows], {
        type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${sluggify(title)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
const PaginationButtons = ({ count, page, rowsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(count / rowsPerPage) - 1;

    const handlePageClick = (newPage) => {
        onPageChange(null, newPage);
    };

    const visiblePageNumbers = () => {
        const currentPage = page + 1;
        const totalVisible = 5; // Number of visible page buttons
        const pages = [];

        let start = Math.max(1, currentPage - Math.floor(totalVisible / 2));
        let end = Math.min(totalPages + 1, start + totalVisible - 1);

        if (end - start + 1 < totalVisible) {
            start = Math.max(1, end - totalVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        // if(!pages.includes(1))pages.unshift(1);
        // if(!pages.includes(totalPages))pages.push(totalPages)
        return pages;
    };

    return (
        <Box sx={ { display: "flex", alignItems: "center", gap: 1 } }>
            <IconButton
                onClick={ () => handlePageClick(0) }
                disabled={ page === 0 }
                aria-label="first page"
            >
                <KeyboardDoubleArrowLeft />
            </IconButton>
            <IconButton
                onClick={ () => handlePageClick(page - 1) }
                disabled={ page === 0 }
                aria-label="previous page"
            >
                <KeyboardArrowLeft />
            </IconButton>

            <ButtonGroup variant="text">
                { visiblePageNumbers().map((pageNumber) => (
                    <Button
                        key={ pageNumber }
                        onClick={ () => handlePageClick(pageNumber - 1) }
                        disabled={ page === pageNumber - 1 }
                        sx={ {
                            minWidth: 32,
                            fontWeight: page === pageNumber - 1 ? "bold" : "normal",
                            color: page === pageNumber - 1 ? "primary.main" : "inherit",
                        } }
                    >
                        { pageNumber }
                    </Button>
                )) }
            </ButtonGroup>

            <IconButton
                onClick={ () => handlePageClick(page + 1) }
                disabled={ page >= totalPages }
                aria-label="next page"
            >
                <KeyboardArrowRight />
            </IconButton>

            <IconButton
                onClick={ () => handlePageClick(totalPages) }
                disabled={ page >= totalPages }
                aria-label="last page"
            >
                <KeyboardDoubleArrowRight />
            </IconButton>
        </Box>
    );
};
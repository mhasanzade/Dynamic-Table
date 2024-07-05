import React from "react";

const DynamicTable = ({ data }) => {

    const top = data.filter(item => item.place === 'top');
    const left = data.filter(item => item.place === 'left');

    const findMaxPathLength = (data) => {
        return Math.max(...data.map(node => findLongestPathLength(node)));
    };

    const findLongestPathLength = (node, depth = 1) => {
        if (!node.children || node.children.length === 0) {
            return depth;
        }
        return Math.max(...node.children.map(child => findLongestPathLength(child, depth + 1)));
    };

    const maxDepth = findMaxPathLength(top);
    const maxLength = findMaxPathLength(left);

    const countEmptyChildrenArrays = (obj) => {
        let count = 0;

        const traverse = (node) => {
            if (node.children && node.children.length === 0) {
                count++;
            } else if (node.children && node.children.length > 0) {
                node.children.forEach(child => traverse(child));
            }
        };

        traverse(obj);
        return count;
    };

    const createColumns = (nodes, maxDepth) => {
        let currentNumeration = 1;
        let lastMainNumber = 0;
        let subNumber = 1;
        let arr = [];

        const getNumeration = (isSub) => {
            if (isSub == 1) {
                return `${lastMainNumber}-${subNumber++}`;
            } else {
                lastMainNumber = currentNumeration++;
                subNumber = 1;
                return lastMainNumber;
            }
        };

        const columns = Array.from({ length: maxDepth }, () => []);

        const traverse = (node, depth) => {
            columns[depth].push(<>
                <td key={node.id} colSpan={countEmptyChildrenArrays(node)} rowSpan={node.children.length === 0 ? maxDepth - depth : 1}
                    style={{
                        textAlign: node.text_align,
                        fontWeight: node.font_weight,
                        fontStyle: node.font_style,
                        fontSize: node.font_size ? (isNaN(node.font_size) ? node.font_size : `${node.font_size}px`) : undefined,
                        ...(node.orientation === "vertical" && {
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)"
                        })
                    }}>
                    {node.name}
                </td>
            </>);

            if (node.children && node.children.length > 0) {
                node.children.forEach(child => traverse(child, depth + 1));
            } else {
                arr.push(node);
            }
        };

        nodes.forEach(node => traverse(node, 0));

        columns[0].unshift(
            <>
                <td rowSpan={maxDepth} colSpan={maxLength} style={{ textAlign: "center" }}>&nbsp;</td>
                <td rowSpan={maxDepth} style={{ textAlign: "center", fontWeight: "bold", writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "12px" }}>Sətrin №-si</td>
            </>
        )

        columns.push(
            <>
                <td colSpan={maxLength} style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>A</td>
                <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>B</td>
                {arr.map((node, index) => <td key={`num - ${index}`} style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>
                    {getNumeration(node.is_sub)}
                </td>)}
            </>
        )
        return { columns, arrLength: arr.length };
    };

    const createRows = (nodes, maxLength) => {
        const rows = [];
        let currentNumeration = 1;
        let lastMainNumber = 0;
        let subNumber = 1;

        const getNumeration = (isSub) => {
            if (isSub == 1) {
                return `${lastMainNumber}-${subNumber++}`;
            } else {
                lastMainNumber = currentNumeration++;
                subNumber = 1;
                return lastMainNumber;
            }
        };

        const traverse = (node, depth, parentRowIndex) => {
            const cell = (
                <>
                    <td key={node.id} colSpan={node.children.length === 0 ? maxLength - depth : 1} rowSpan={countEmptyChildrenArrays(node)}
                        style={{
                            textAlign: node.text_align,
                            fontWeight: node.font_weight,
                            fontStyle: node.font_style,
                            fontSize: node.font_size ? (isNaN(node.font_size) ? node.font_size : `${node.font_size}px`) : undefined,
                            ...(node.orientation === "vertical" && {
                                writingMode: "vertical-rl",
                                transform: "rotate(180deg)"
                            })
                        }}>
                        {node.name}
                    </td>
                    {node.children.length === 0 && (
                        <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px" }}>
                            {getNumeration(node.is_sub)}
                        </td>
                    )}
                </>
            );

            rows[parentRowIndex].push(cell);

            if (node.children && node.children.length > 0) {
                let firstChildHandled = false;
                node.children.forEach((child, index) => {
                    if (!firstChildHandled) {
                        traverse(child, depth + 1, parentRowIndex);
                        firstChildHandled = true;
                    } else {
                        rows.push([]);
                        traverse(child, depth + 1, rows.length - 1);
                    }
                });
            }
        };

        nodes.forEach(node => {
            rows.push([]);
            traverse(node, 0, rows.length - 1);
        });


        rows.forEach(row => {
            row.push(...Array.from({ length: columns.arrLength }, () => (
                <td style={{ borderStyle: "dashed" }}></td>
            )));
        })

        return rows;
    };

    const columns = createColumns(top, maxDepth);
    const rows = createRows(left, maxLength);

    return (
        <table>
            <colgroup>
                <col span={maxLength} />
                <col span={1} style={{ border: '2px solid black' }} />
            </colgroup>
            <tbody>
                {columns.columns.map((column, index) => (
                    <tr key={column.id} style={index === columns.columns.length - 1 ? { border: "3px solid black" } : {}}>{column}</tr>
                ))}
                {rows.map(row => (
                    <tr key={row.id}>{row}</tr>
                ))}
            </tbody>
        </table>
    );
};

export default DynamicTable;
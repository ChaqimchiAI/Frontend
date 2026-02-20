import { Table, Badge } from "react-bootstrap";

const StudentAttendances = ({ textColor }) => {
    return (
        <Table responsive borderless className={textColor}>
            <thead>
                <tr className="border-bottom border-secondary border-opacity-25 opacity-50 small">
                    <th>SANA</th>
                    <th>GURUH</th>
                    <th>HOLAT</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>07.02.2026</td>
                    <td>MM Arab tili J</td>
                    <td><Badge bg="success">Kelgan</Badge></td>
                </tr>
                <tr>
                    <td>05.02.2026</td>
                    <td>MM Arab tili J</td>
                    <td><Badge bg="danger">Kelmagan</Badge></td>
                </tr>
            </tbody>
        </Table>
    );
};

export default StudentAttendances;

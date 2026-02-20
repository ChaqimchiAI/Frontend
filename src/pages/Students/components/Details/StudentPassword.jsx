import { Button } from "react-bootstrap";
import { Input } from "../../../../components/Ui/Input";

const StudentPassword = ({ currentStudent }) => {
    return (
        <div style={{ width: "100%" }}>
            <Input
                label="Login"
                defaultValue={currentStudent?.phone}
                className="mb-3"
                style={{ width: "50%" }}
            />
            <Input
                label="Yangi parol"
                type="password"
                defaultValue={currentStudent?.username}
                placeholder="*****"
                containerClassName="col-md-6"
            />
            <div className="mt-5 d-flex justify-content-end">
                <Button className="btn btn-sm save-button">
                    Saqlash
                </Button>
            </div>
        </div>
    );
};

export default StudentPassword;

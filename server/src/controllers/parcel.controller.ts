import officeModel from "@/models/office.model";
import parcelModel from "@/models/parcel.model";
import trackingModel from "@/models/tracking.model";
import { InputError, Request, Response } from "@/types/controller";
import handleError from "@/utils/handle_error";
import ParcelValidator, { IParcelCreate, IParcelUpdate, IParcelUpdateStatus } from "@/validators/parcel.validator";

export default class ParcelController {
    private static async precheck(data: IParcelCreate | Omit<IParcelUpdate, "id">) {
        if (data.receiving_office) {
            const offices = await officeModel.getOffices([data.receiving_office])
            if (offices.length === 0) throw new InputError("Invalid office id", "receiving_office");
        }
    }

    public static async create(req: Request, res: Response) {
        const data = <IParcelCreate>req.body;
        const user = res.locals.user;

        handleError(res, async () => {
            ParcelValidator.validateCreate(data);
            await ParcelController.precheck(data);
            data.sending_office = user.office;
            
            const parcel_id = await parcelModel.create(data);
            if (!parcel_id) throw new InputError("Can not created parcel", "_");
            const tracking_id = await trackingModel.create({
                parcel: parcel_id,
                office: user.office,
                uid: user.uid
            });

            res.status(200).json({ message: "Created successfully", data: { parcel_id, tracking_id } })
        })
    }

    public static async delete(req: Request, res: Response) {
        const id = req.params.id;
        const user = res.locals.user;

        handleError(res, async () => {
            ParcelValidator.validateDelete({ id });

            const ok = await parcelModel.delete(id, user.office);
            res.json({ message: ok ? "Deleted successfully" : "Unable to delete", data: { id } });
        })
    }

    public static async update(req: Request, res: Response) {
        const id = req.params.id;
        const data = <Omit<IParcelUpdate, "id">>req.body;
        const user = res.locals.user;

        handleError(res, async () => {
            ParcelValidator.validateUpdate({ id, ...data });
            await ParcelController.precheck(data);

            const ok = await parcelModel.update(id, user.office, data);
            res.json({ message: ok ? "Deleted successfully" : "Unable to delete", data: { id } });
        })
    }

    public static async updateStatus(req: Request, res: Response) {
        const id = req.params.id;
        const data = <Omit<IParcelUpdateStatus, "id">>req.body;
        const user = res.locals.user;

        handleError(res, async () => {
            ParcelValidator.validateUpdateStatus({ id, ...data });

            const ok_tracking = await trackingModel.push(id, { ...data, uid: user.uid, office: user.office })
            if (!ok_tracking) throw new InputError("Unable to push new event", "event");
            const ok_parcel = await parcelModel.updateStatus(id, data)
            res.json({ message: ok_parcel ? "Updated status successfully" : "Unable to update status" })
        })
    }
}
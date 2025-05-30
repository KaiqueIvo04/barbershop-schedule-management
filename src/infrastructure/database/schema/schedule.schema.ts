import Mongoose from 'mongoose'

interface IScheduleModel extends Mongoose.Document {
}

const ScheduleSchema = new Mongoose.Schema({
    responsible_employee_id: {
        type: Mongoose.Schema.Types.ObjectId,
        index: true
    },
    responsible_client_id: {
        type: Mongoose.Schema.Types.ObjectId,
        index: true
    },
    status: String,
    responsible_admin_id: {
        type: Mongoose.Schema.Types.ObjectId,
        index: true
    },
    service_ids: [Mongoose.Schema.Types.ObjectId]

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

// Removes optional fields sended with empty strings in findOneAndUpdate operations
ScheduleSchema.pre('findOneAndUpdate', function (_next) {
    const next = getNext(_next)
    try {
        const updateParams = this.getUpdate()
        if (updateParams) {
            // Building $unset parameter to remove optional fields.
            for (const key of Object.keys(updateParams)) {
                if (updateParams[key] === '') {
                    const unsetKey = '$unset'
                    if (!updateParams[unsetKey]) updateParams[unsetKey] = {}
                    updateParams[unsetKey][key] = 1
                    delete updateParams[key]
                }
            }
        }
        next()
    } catch (err) {
        next(err)
    }
})

// For mongoose 4/5 compatibility.
function nextErr(err) {
    if (err) throw err
}

function getNext(next) {
    if (typeof next !== 'function') return nextErr
    return next
}

// Sets created_at as index.
ScheduleSchema.index({ created_at: 1 })

export const ScheduleRepoModel = Mongoose.model<IScheduleModel>('Schedule', ScheduleSchema)
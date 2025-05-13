using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    public interface IRadioToggle
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> btn_1;
        event EventHandler<UIEventArgs> btn_2;
        event EventHandler<UIEventArgs> btn_3;
        event EventHandler<UIEventArgs> btn_4;
        event EventHandler<UIEventArgs> btn_5;

        void btn_1_fb(RadioToggleBoolInputSigDelegate callback);
        void btn_2_fb(RadioToggleBoolInputSigDelegate callback);
        void btn_3_fb(RadioToggleBoolInputSigDelegate callback);
        void btn_4_fb(RadioToggleBoolInputSigDelegate callback);
        void btn_5_fb(RadioToggleBoolInputSigDelegate callback);
        void label_1(RadioToggleStringInputSigDelegate callback);
        void label_2(RadioToggleStringInputSigDelegate callback);
        void label_3(RadioToggleStringInputSigDelegate callback);
        void label_4(RadioToggleStringInputSigDelegate callback);
        void label_5(RadioToggleStringInputSigDelegate callback);

    }

    public delegate void RadioToggleBoolInputSigDelegate(BoolInputSig boolInputSig, IRadioToggle radioToggle);
    public delegate void RadioToggleStringInputSigDelegate(StringInputSig stringInputSig, IRadioToggle radioToggle);

    internal class RadioToggle : IRadioToggle, IDisposable
    {
        #region Standard CH5 Component members

        private ComponentMediator ComponentMediator { get; set; }

        public object UserObject { get; set; }

        public uint ControlJoinId { get; private set; }

        private IList<BasicTriListWithSmartObject> _devices;
        public IList<BasicTriListWithSmartObject> Devices { get { return _devices; } }

        #endregion

        #region Joins

        private static class Joins
        {
            internal static class Booleans
            {
                public const uint btn_1 = 1;
                public const uint btn_2 = 2;
                public const uint btn_3 = 3;
                public const uint btn_4 = 4;
                public const uint btn_5 = 5;

                public const uint btn_1_fb = 1;
                public const uint btn_2_fb = 2;
                public const uint btn_3_fb = 3;
                public const uint btn_4_fb = 4;
                public const uint btn_5_fb = 5;
            }
            internal static class Strings
            {

                public const uint label_1 = 1;
                public const uint label_2 = 2;
                public const uint label_3 = 3;
                public const uint label_4 = 4;
                public const uint label_5 = 5;
            }
        }

        #endregion

        #region Construction and Initialization

        internal RadioToggle(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.btn_1, onbtn_1);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.btn_2, onbtn_2);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.btn_3, onbtn_3);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.btn_4, onbtn_4);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.btn_5, onbtn_5);

        }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Devices.Add(device);
            ComponentMediator.HookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Devices.Remove(device);
            ComponentMediator.UnHookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        #endregion

        #region CH5 Contract

        public event EventHandler<UIEventArgs> btn_1;
        private void onbtn_1(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = btn_1;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> btn_2;
        private void onbtn_2(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = btn_2;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> btn_3;
        private void onbtn_3(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = btn_3;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> btn_4;
        private void onbtn_4(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = btn_4;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> btn_5;
        private void onbtn_5(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = btn_5;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void btn_1_fb(RadioToggleBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.btn_1_fb], this);
            }
        }

        public void btn_2_fb(RadioToggleBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.btn_2_fb], this);
            }
        }

        public void btn_3_fb(RadioToggleBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.btn_3_fb], this);
            }
        }

        public void btn_4_fb(RadioToggleBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.btn_4_fb], this);
            }
        }

        public void btn_5_fb(RadioToggleBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.btn_5_fb], this);
            }
        }


        public void label_1(RadioToggleStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.label_1], this);
            }
        }

        public void label_2(RadioToggleStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.label_2], this);
            }
        }

        public void label_3(RadioToggleStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.label_3], this);
            }
        }

        public void label_4(RadioToggleStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.label_4], this);
            }
        }

        public void label_5(RadioToggleStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.label_5], this);
            }
        }

        #endregion

        #region Overrides

        public override int GetHashCode()
        {
            return (int)ControlJoinId;
        }

        public override string ToString()
        {
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "RadioToggle", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            btn_1 = null;
            btn_2 = null;
            btn_3 = null;
            btn_4 = null;
            btn_5 = null;
        }

        #endregion

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    public interface ITVs
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> on_btn;
        event EventHandler<UIEventArgs> off_btn;
        event EventHandler<UIEventArgs> hdmi1_btn;
        event EventHandler<UIEventArgs> hdmi2_btn;
        event EventHandler<UIEventArgs> hdmi3_btn;

        void on_fb(TVsBoolInputSigDelegate callback);
        void off_fb(TVsBoolInputSigDelegate callback);
        void hdmi1_fb(TVsBoolInputSigDelegate callback);
        void hdmi2_fb(TVsBoolInputSigDelegate callback);
        void hdmi3_fb(TVsBoolInputSigDelegate callback);
        void hdmi1_label(TVsStringInputSigDelegate callback);
        void hdmi2_label(TVsStringInputSigDelegate callback);
        void hdmi3_label(TVsStringInputSigDelegate callback);

    }

    public delegate void TVsBoolInputSigDelegate(BoolInputSig boolInputSig, ITVs tVs);
    public delegate void TVsStringInputSigDelegate(StringInputSig stringInputSig, ITVs tVs);

    internal class TVs : ITVs, IDisposable
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
                public const uint on_btn = 1;
                public const uint off_btn = 2;
                public const uint hdmi1_btn = 3;
                public const uint hdmi2_btn = 4;
                public const uint hdmi3_btn = 5;

                public const uint on_fb = 1;
                public const uint off_fb = 2;
                public const uint hdmi1_fb = 3;
                public const uint hdmi2_fb = 4;
                public const uint hdmi3_fb = 5;
            }
            internal static class Strings
            {

                public const uint hdmi1_label = 1;
                public const uint hdmi2_label = 2;
                public const uint hdmi3_label = 3;
            }
        }

        #endregion

        #region Construction and Initialization

        internal TVs(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.on_btn, onon_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.off_btn, onoff_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.hdmi1_btn, onhdmi1_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.hdmi2_btn, onhdmi2_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.hdmi3_btn, onhdmi3_btn);

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

        public event EventHandler<UIEventArgs> on_btn;
        private void onon_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = on_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> off_btn;
        private void onoff_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = off_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> hdmi1_btn;
        private void onhdmi1_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = hdmi1_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> hdmi2_btn;
        private void onhdmi2_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = hdmi2_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> hdmi3_btn;
        private void onhdmi3_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = hdmi3_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void on_fb(TVsBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.on_fb], this);
            }
        }

        public void off_fb(TVsBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.off_fb], this);
            }
        }

        public void hdmi1_fb(TVsBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.hdmi1_fb], this);
            }
        }

        public void hdmi2_fb(TVsBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.hdmi2_fb], this);
            }
        }

        public void hdmi3_fb(TVsBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.hdmi3_fb], this);
            }
        }


        public void hdmi1_label(TVsStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.hdmi1_label], this);
            }
        }

        public void hdmi2_label(TVsStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.hdmi2_label], this);
            }
        }

        public void hdmi3_label(TVsStringInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].StringInput[Joins.Strings.hdmi3_label], this);
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
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "TVs", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            on_btn = null;
            off_btn = null;
            hdmi1_btn = null;
            hdmi2_btn = null;
            hdmi3_btn = null;
        }

        #endregion

    }
}
